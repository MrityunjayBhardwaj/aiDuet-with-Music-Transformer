import 'style/splash.css'
import events from 'events'

import saveGenMusic from 'finalInterface/saveGenMusic'
import retry from 'finalInterface/retry'

class finalSplash extends events.EventEmitter{
	constructor(container, genMidi){

		super()
		const splash = this._splash = document.createElement('div')
		splash.id = 'splash'
		container.appendChild(splash)

		// the title
		const titleContainer = document.createElement('div')
		titleContainer.id = 'titleContainer'
		splash.appendChild(titleContainer)

		const save= document.createElement('div')
		save.id = 'subTitle'
		save.textContent = 'Did you like why you just heard?'
		titleContainer.appendChild(save)

        this._clicked = false
        const saveGM = this._loader = new saveGenMusic(titleContainer)
        saveGM.on('click', ()=>{

			saveAs(new File([genMidi], 'transcription.mid'))
        })


		const retryContainer = document.createElement('div')
		retryContainer.id = 'subTitle'
		retryContainer.textContent = 'Or maybe you wanna experiment more?'
        titleContainer.appendChild(retryContainer)
        
        const retryBtn = new retry(titleContainer);

        retryBtn.on('click', ()=>{

			// for now just reload the page..
			// TODO: implement the retry more appropriately.
			location.reload();
        })

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

export {finalSplash}