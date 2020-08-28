/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Keyboard} from 'keyboard/Keyboard'
import {AI} from 'ai/AI'
import {Sound} from 'sound/Sound'
import {Glow} from 'interface/Glow'
import {Splash} from 'interface/Splash'
import {About} from 'interface/About'
import {Tutorial} from 'ai/Tutorial'
import 'babel-polyfill'
import {AIRaw} from "./ai/AIRaw";
import events from "events";

/////////////// SPLASH ///////////////////	

const about = new About(document.body)
const splash = new Splash(document.body)

class Recorder {

	constructor(ai){
		this.ai = ai;
		this.recorder = undefined;
		this.btnRecord = undefined;
		this.isRecording = false;
		this.chunks = [];
	}


 init() {
	this.btnRecord = document.getElementById("btnRecord");
	this.btnRecord.addEventListener('click', () => {
		// Things are broken on old ios
		if (!navigator.mediaDevices) {
			console.log('disabled')
			this.btnRecord.disabled = true;
			return;
		}

		if (this.isRecording) {
			this.isRecording = false;
			this.updateRecordBtn(true);
			this.recorder.stop();
		} else {
			// Request permissions to record audio. Also this sometimes fails on Linux. I don't know.
			if (this.recorder) {
				this.isRecording = true;
				this.recorder.start();
			}
			else {
				navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
					this.isRecording = true;
					this.updateRecordBtn(false);
					this.recorder = new window.MediaRecorder(stream);
					this.recorder.ondataavailable = (e) => {
						console.log("GOT DATA")
						this.updateWorkingState(this.btnRecord);
						//this.chunks.push(e.data);
						this.transcribeFromFile(e.data)
					};
					this.recorder.start();
					window.setInterval(() => {
						if (this.isRecording)
						{this.recorder.requestData()}
					}, 5000);
				}, () => {
					this.btnRecord.disabled = true;
				});
			}
		}
	});
}


	updateWorkingState(active) {
	  active.classList.add('working');
	}

	updateRecordBtn(defaultState) {
	  const el = this.btnRecord.firstElementChild;
	  el.textContent = defaultState ? 'Record Audio' : 'Stop';
	}

	transcribeFromFile(blob) {
		console.log("Transcribing " + blob)
		this.ai.submit(blob)
	}
}

splash.on('click', () => {
	keyboard.activate()
	tutorial.start()
	about.showButton()
})
splash.on('about', () => {
	about.open(true)
})
about.on('close', () => {
	if (!splash.loaded || splash.isOpen()){
		splash.show()
	} else {
		keyboard.activate()
	}
})
about.on('open', () => {
	keyboard.deactivate()
	if (splash.isOpen()){
		splash.hide()
	}
})


/////////////// PIANO ///////////////////

const container = document.createElement('div')
container.id = 'container'
document.body.appendChild(container)

const glow = new Glow(container)
const keyboard = new Keyboard(container)

const sound = new Sound()
sound.load()

keyboard.on('keyDown', (note) => {
	sound.keyDown(note)
	ai.keyDown(note)
	glow.user()
})

keyboard.on('keyUp', (note) => {
	sound.keyUp(note)
	ai.keyUp(note)
	glow.user()
})

/////////////// AI ///////////////////

const ai = new AIRaw()

const recorder = new Recorder(ai)
console.log("GOT REECODER")

recorder.init();


ai.on('keyDown', (note, time) => {
	sound.keyDown(note, time, true)
	keyboard.keyDown(note, time, true)
	glow.ai(time)
})

ai.on('keyUp', (note, time) => {
	sound.keyUp(note, time, true)
	keyboard.keyUp(note, time, true)	
	glow.ai(time)
})

/////////////// TUTORIAL ///////////////////

const tutorial = new Tutorial(container)

tutorial.on('keyDown', (note, time) => {
	sound.keyDown(note, time)
	keyboard.keyDown(note, time)
	glow.user()
})

tutorial.on('keyUp', (note, time) => {
	sound.keyUp(note, time)
	keyboard.keyUp(note, time)
	glow.user()
})

tutorial.on('aiKeyDown', (note, time) => {
	ai.keyDown(note, time)
})

tutorial.on('aiKeyUp', (note, time) => {
	ai.keyUp(note, time)
})