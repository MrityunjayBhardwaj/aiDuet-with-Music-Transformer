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
import {audioSplash} from 'audioInterface/audioSplash'
import {About} from 'interface/About'
import {Tutorial} from 'ai/Tutorial'
import 'babel-polyfill'

/////////////// SPLASH ///////////////////	

const about = new About(document.body)
const splash = new Splash(document.body)

splash.on('click', () => {
	piano();

})

splash.on('about', () => {
	about.open(true)
})

splash.on('audio', ()=>{
	// TODO: insert the piano transcribe frontend
	audio();
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

const sound = new Sound()
sound.load()
const glow = new Glow(container)
const keyboard = new Keyboard(container)

function piano(){

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

	keyboard.activate()
	about.showButton()

	// ? do we really need the tutorial?
	// const tutorial = tuts();
	// tutorial.start() 
}

////////////////// AUDIO ////////////////////

function audio(){
	/* placeholder code */

	const audSplash = new audioSplash(document.body);

	let transcribingSplash = null;
	let recordingSplash = null;
	let generatingMusicSplash = null;

	audSplash.on('transcribing', () => {
	// TODO: change the ui appropriately
		transcribingSplash = transcribing(document.body);

	})


	// finished transcribing the audio
	audSplash.on('finished', ()=>{

		transcribingSplash.remove();
		// console.log('finished transcribing and removed the transcribe splash screen', transcribingSplash)
    
	})

	audSplash.on('generateMusic',()=>{

		console.log('started generating musiq')

		generatingMusicSplash = generatingMusic(document.body);
	})

	audSplash.on('finishedGenerating', ()=>{

		document.body.removeChild(generatingMusicSplash);
	})

	audSplash.on('finishedRecording', ()=>{

		document.body.removeChild(recordingSplash)

		console.log('finished rec', recordingSplash)

	})


	audSplash.on('recClick', ()=> {
		recordingSplash = recording(document.body, audSplash)
	})

	keyboard.activate()
	audSplash.on('keyDown', (note, time, ai) => {
		sound.keyDown(note, time, ai)
		keyboard.keyDown(note, time, ai)
	})

	audSplash.on('keyUp', (note, time, ai) => {
		sound.keyUp(note, time, ai)
		keyboard.keyUp(note, time, ai)
		if (ai){glow.ai(time)}
	})
}

/////////////// Transcribing /////////////////

function transcribing(container){
	const splash = document.createElement('div')
	splash.id = 'splash'
	container.appendChild(splash)

	// the title
	const titleContainer = document.createElement('div')
	titleContainer.id = 'titleContainer'
	splash.appendChild(titleContainer)

	const title = document.createElement('div')
	title.id = 'title_orange'
	title.textContent = 'transcribing...'
	titleContainer.appendChild(title)

	const subTitle = document.createElement('div')
	subTitle.id = 'subTitle'
	titleContainer.appendChild(subTitle)
	subTitle.textContent = 'your robots are working on your file.'

	return splash;
}

function generatingMusic(container){
	const splash = document.createElement('div')
	splash.id = 'splash'
	container.appendChild(splash)

	// the title
	const titleContainer = document.createElement('div')
	titleContainer.id = 'titleContainer'
	splash.appendChild(titleContainer)

	const title = document.createElement('div')
	title.id = 'title_orange'
	title.textContent = 'generating...'
	titleContainer.appendChild(title)

	const subTitle = document.createElement('div')
	subTitle.id = 'subTitle'
	titleContainer.appendChild(subTitle)
	subTitle.textContent = 'your robots are creating new piece of music for you.. please wait, its going to take a white.'

	// TODO: maybe add a loading animation loop

	return splash;
}

function recording(container,audSplash){
	const splash = document.createElement('div')
	splash.id = 'splash'
	container.appendChild(splash)

	// the title
	const titleContainer = document.createElement('div')
	titleContainer.id = 'titleContainer'
	splash.appendChild(titleContainer)

	const title = document.createElement('div')
	title.id = 'title_orange'
	title.textContent = 'Recording...'
	titleContainer.appendChild(title)

	title.style.cursor = "pointer"
	title.classList.add('clickable');

	// stop the recording if the recording title was clicked again
	title.addEventListener('click', ()=>{
		audSplash.emit('transcribing')

		title.textContent = "Stop"

		audSplash.recorder.requestData();
	})

	return splash;
}




/////////////// AI ///////////////////

const ai = new AI()

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

function tuts(keyboard, sound, glow){

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

	return tutorial;
}
