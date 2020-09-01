import 'style/splash.css'
import events from 'events'

import micInput from 'audioInterface/micInput'
import audioFileInput from 'audioInterface/audioFileInput'
import {AI} from 'ai/AI'
import { AIRaw } from 'ai/AIRaw'
import Tone from 'Tone/core/Tone'

// TODO: use it through modules instaed of putting it into the main index html
// import model from 'transcribeAI/transcribe'

class audioSplash extends events.EventEmitter{
	constructor(container){
		console.log("Loading audi splash")

		super()
		const splash = this._splash = document.createElement('div')
		splash.id = 'splash'
		container.appendChild(splash)

		// the title
		const titleContainer = document.createElement('div')
		titleContainer.id = 'titleContainer'
		splash.appendChild(titleContainer)

		const title = document.createElement('div')
		title.id = 'title'
		title.textContent = 'Audio'
		titleContainer.appendChild(title)

		const subTitle = document.createElement('div')
		subTitle.id = 'subTitle'
		titleContainer.appendChild(subTitle)
        subTitle.textContent = 'specify which audio input to use'
		this.aiRaw = new AIRaw();
		this._aiEndTime = 0;
		this.bound_load = this.load.bind(this)
		this.last_note = 0


        this._clicked = false
        const fileInp = this._loader = new audioFileInput(titleContainer)
        fileInp.on('uploaded', (file) => {
			splash.classList.add('disappear')
			// Starts transcribing..
			console.log('started transcribing the input music file')
			this.emit('transcribing')
			this.transcribeFromFile(file.target.files[0])
			
			this._clicked = true
        } )

        const recInp = this._loader = new micInput(titleContainer)
        recInp.on('click', () => {
            splash.classList.add('disappear')
			navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
            //console.log('CLONING STEAM')
            //roll.set_stream(stream.clone())
			console.log("Recording")

            this.recorder = new window.MediaRecorder(stream);
            this.recorder.ondataavailable = (e) => {
                this.transcribeFromFile(e.data)
            };
            this.recorder.start();
            this.isRecording = true;
        });
			this._clicked = true
            this.emit('recClick')
        } )

    }

    transcribeFromFile(file){
			if (this.isRecording) {
				console.log("Stopping recording")
				this.isRecording = false;
				this.recorder.stop()
				this.emit('finishedRecording')
			}
			const cElement = this;
					// TODO: preload this model
			const model = new mm.OnsetsAndFrames('https://storage.googleapis.com/magentadata/js/checkpoints/transcription/onsets_frames_uni');
			model.initialize().then(()=>{
				model.transcribeFromAudioFile(file).then((ns) => {
					// making space for future files to be uploaded...
					//file.value = null; //TODO maybe reactivate this
					console.log('transcription finished!')
					cElement.emit('finished');
					this.play_node_sequence(ns).then((seqDueration)=>{

						console.log('finished playing note sequences')

						let isMusicGenerated = 0;

						// exporting the generated note sequence to the backend...
						this.aiRaw.submitNS(ns, this.bound_load).then(()=>{
							isMusicGenerated = 1;
							cElement.emit('finishedGenerating')
						})

						// waiting for the last note bars to leave the screen before invoking the generateMuisc event...
						setTimeout(()=>{if(!isMusicGenerated)cElement.emit('generateMusic')}, seqDueration + 1000)
						
					})
					
				})
			})
	}

    play_node_sequence(ns) {
		console.log(ns, )

		return new Promise((resolve)=>{
			let len = 0;
			ns.notes.forEach( (note,i) => {
				const now = Tone.now() + 0.05
				this.emit('keyDown', note.pitch, note.startTime + now, false)
				this.emit('keyUp', note.pitch, note.endTime + now, false)
				this.last_note = note.endTime + now
				len += this.last_note;

				// console.log(i, len, now, len, ns.notes.length)
			})
			setTimeout(()=>{resolve(Math.floor(len*10*1))}, )
		})
	}

    load(response){

		response.tracks[1].notes.forEach((note, i) => {
			const now = Math.max(Tone.now() + 0.05, this.last_note)
			if (note.noteOn + now > this._aiEndTime){
				this._aiEndTime = note.noteOn + now
				this.emit('keyDown', note.midi, note.noteOn + now, true)
				note.duration = note.duration * 0.9
				note.duration = Math.min(note.duration, 4)
				this.emit('keyUp', note.midi, note.noteOff + now, true)
			}

		})


		const seqDuration = response.duration* response.tracks[1].notes.length*10;

		setTimeout(()=>{

			console.log('finished playing the generated music on the  ')
			this.emit('finishedPlayingGenMusic', response)

		}, seqDuration)


	}

	get loaded(){
		return this._loader.loaded
	}
	isOpen(){
		return !this._clicked
	}

	show(){
		this._splash.classList.remove('disappear')
	}

	hide(){
		this._splash.classList.add('disappear')
	}
}

export {audioSplash}