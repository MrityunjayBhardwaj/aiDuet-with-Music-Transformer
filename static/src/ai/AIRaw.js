import Tone from 'Tone/core/Tone'
import MidiConvert from 'midiconvert'
import events from 'events'


class AIRaw extends events.EventEmitter {

	constructor(){
		super();
		this._aiEndTime = 0
	}

	submit(blob) {
			blob.text().onload = function() {

			}

			;
			var fd = new FormData();
			console.log(blob.size)
			fd.append("blob", blob, 'audio.mp3');
			var request = new XMLHttpRequest();
			request.open("POST", './predict_raw', true);
			request.setRequestHeader("Content-type","multipart/form-data")
			console.log(fd.has('blob'))
			request.send(fd)
		request.onload=function() {
        alert(this.response);
    };

}
}

export {AIRaw}