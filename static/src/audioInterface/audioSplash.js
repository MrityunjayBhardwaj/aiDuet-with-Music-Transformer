import 'style/splash.css'
import events from 'events'

import micInput from 'audioInterface/micInput'
import audioFileInput from 'audioInterface/audioFileInput'
import {AI} from 'ai/AI'
import { AIRaw } from 'ai/AIRaw'

// TODO: use it through modules instaed of putting it into the main index html
// import model from 'transcribeAI/transcribe'

class audioSplash extends events.EventEmitter{
	constructor(container){

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

        this._clicked = false
        const fileInp = this._loader = new audioFileInput(titleContainer)
        fileInp.on('uploaded', (file)=>{
			splash.classList.add('disappear')
			const cElement = this;

			// Starts transcribing..
			console.log('started transcribing the input music file')

			// TODO: preload this model
			const model = new mm.OnsetsAndFrames('https://storage.googleapis.com/magentadata/js/checkpoints/transcription/onsets_frames_uni');
			model.initialize().then(()=>{

				model.transcribeFromAudioFile(file.target.files[0]).then((ns) => {
					// making space for future files to be uploaded...
					file.value = null;
					console.log('transcription finished!')

					cElement.emit('finished');
					

					const aiRaw = new AIRaw();
					// exporting the generated note sequence to the backend...
					aiRaw.submitNS(ns)
				})
			})

			
			this._clicked = true
            this.emit('transcribing')
        } )

        const recInp = this._loader = new micInput(titleContainer)
        recInp.on('click', ()=>{
            splash.classList.add('disappear')
			this._clicked = true
            this.emit('recClick')
        } )

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