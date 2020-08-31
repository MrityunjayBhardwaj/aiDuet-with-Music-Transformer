import Tone from 'Tone/core/Tone'
import MidiConvert from 'midiconvert'
import events from 'events'


class AIRaw extends events.EventEmitter {

    constructor() {
        super();
		this._newTrack()
    }

    _newTrack(){
		this._midi = new MidiConvert.create()
	}

    submitNS(ns, onload) {
    	console.log('starting the request');
			this._midi.load(`./predict_frames`, JSON.stringify(ns), 'POST').then((response) => {
				onload(response)
				this._newTrack()
			})
    }

    submit(blob) {
        /*
                blob.text().then(t => {
                    var request = new XMLHttpRequest();
                    request.open("POST", './predict_raw', true);
                    request.send(t)
                    request.onload = function () {
                        console.log(this.response);
                    }
                });
                */


        blob.arrayBuffer().then(buffer => {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', './predict_raw', true);
            xhr.onload = function () {
                console.log(this.response);
            }
            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            xhr.send(buffer);
        })


    }

}

export {AIRaw}