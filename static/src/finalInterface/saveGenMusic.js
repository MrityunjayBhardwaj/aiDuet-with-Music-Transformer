import events from 'events'
const EventEmitter = events.EventEmitter

export default class saveGenMusic extends EventEmitter{
	constructor(container){
        super()
        
		const saveBtn = document.createElement('div')
		saveBtn.id = 'audioLoader'
		container.appendChild(saveBtn)

		const fillText = document.createElement('div')
		fillText.id = 'fillText'
        fillText.innerHTML = ' <div id="play">Save it!</div>'
		saveBtn.appendChild(fillText)

        saveBtn.classList.add('clickable')

        saveBtn.addEventListener('click', () => {

            this.emit('click')
        })


    }
}