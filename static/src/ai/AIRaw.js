import Tone from 'Tone/core/Tone'
import MidiConvert from 'midiconvert'
import events from 'events'


class AIRaw extends events.EventEmitter {

    constructor() {
        super();
        this._aiEndTime = 0;
		this._newTrack()
    }

    _newTrack(){
		this._midi = new MidiConvert.create()
	}

    submitMidi(ns) {
    	console.log('starting the request');
			this._midi.load(`./predict_frames`, JSON.stringify(ns), 'POST').then((response) => {
				console.log('requist fulfilled');
				response.tracks[1].notes.forEach((note) => {
					const now = Tone.now() + 0.05
					if (note.noteOn + now > this._aiEndTime){
						this._aiEndTime = note.noteOn + now
						this.emit('keyDown', note.midi, note.noteOn + now)
						note.duration = note.duration * 0.9
						note.duration = Math.min(note.duration, 4)
						this.emit('keyUp', note.midi, note.noteOff + now)
					}
				})
				this._newTrack()
			})
		/*
        let request = new XMLHttpRequest();
        request.open("POST", './predict_frames', true);
        console.log("SUBMITTING")
		request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(ns))
        request.onload = function () {
            console.log(this.response);
        }
        */
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