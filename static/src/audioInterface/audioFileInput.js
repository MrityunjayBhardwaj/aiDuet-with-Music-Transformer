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

        // fillText.innerHTML = '<div id="voice"></div> <div id="play">audio file<input type="file" id="fileInput"></span></div>'
		fillText.innerHTML = 
		`
		<label class="button" id="btnUpload" disabled>
			<span id="play" >Upload file <input type="file" id="fileInput"></span></span>
			<span class="loading">Transcribing...</span>
		</label>
		
		`
		audioInput.appendChild(fillText)

        audioInput.classList.add('clickable')


		const fileInput = document.querySelector('#fileInput');

		fileInput.addEventListener('change', (w)=>{

			console.log('file is uploaded', w)
			this.emit('uploaded', w)

		})


        audioInput.addEventListener('click', () => {

            this.emit('click')
        })


    }
}