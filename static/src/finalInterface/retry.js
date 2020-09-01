import events from 'events'
const EventEmitter = events.EventEmitter

export default class retry extends EventEmitter{
	constructor(container){
        super()
        
		const retryBtn = document.createElement('div')
		retryBtn.id = 'audioLoader'
		container.appendChild(retryBtn)

		const fillText = document.createElement('div')
		fillText.id = 'fillText'
        fillText.innerHTML = ' <div id="play">Retry</div>'
		retryBtn.appendChild(fillText)

        retryBtn.classList.add('clickable')

        retryBtn.addEventListener('click', () => {

            this.emit('click')
        })


    }
}