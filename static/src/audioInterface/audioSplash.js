import 'style/splash.css'
import events from 'events'

import micInput from 'audioInterface/micInput'
import audioFileInput from 'audioInterface/audioFileInput'

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
        fileInp.on('click', ()=>{
            splash.classList.add('disappear')
			this._clicked = true
            this.emit('fileClick')
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