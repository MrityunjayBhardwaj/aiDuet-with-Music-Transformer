import Tone from 'Tone/core/Tone'
import MidiConvert from 'midiconvert'
import events from 'events'


class AIRaw extends events.EventEmitter {

	constructor(){
		super();
		this._aiEndTime = 0
	}

	submit(blob) {
			blob.text().then( t => {
				var request = new XMLHttpRequest();
				request.open("POST", './predict_raw', true);
				request.send(t)
				request.onload = function () {
					console.log(this.response);
				}
			});

			//var fd = new FormData();
			//console.log(blob.size)
			//fd.append("blob", blob, 'audio.mp3');


			//request.setRequestHeader("Content-type","multipart/form-data")
			//console.log(fd.has('blob'))


}
}

export {AIRaw}