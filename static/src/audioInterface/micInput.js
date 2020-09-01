import events from 'events'
const EventEmitter = events.EventEmitter

export default class audioLoader extends EventEmitter{
	constructor(container){
		super()

		const audioInput = document.createElement('div')
		audioInput.id = 'audioLoader'
		container.appendChild(audioInput)

		const fillText = document.createElement('div')
		fillText.id = 'fillText'
        fillText.innerHTML = '<div id="voice"></div> <div id="play">Microphone</div>'
		audioInput.appendChild(fillText)

        audioInput.classList.add('clickable')

        audioInput.addEventListener('click', () => {

            this.emit('click')
        })


    }
}