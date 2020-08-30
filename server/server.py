# 
# Copyright 2016 Google Inc.
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# 

from predict import generate_midi
import os
from flask import send_file, request
import pretty_midi
import sys
if sys.version_info.major <= 2:
    from cStringIO import StringIO
else:
    from io import StringIO

from io import BytesIO
import time
import json

'''
from magenta.models.onsets_frames_transcription.realtime.onsets_frames_transcription_realtime import (
    predict_sequence,
    FLAGS,
    OnsetsTask,
    AudioChunk,
    TfLiteWorker,
    AudioQueue,
)
from magenta.models.onsets_frames_transcription.realtime import audio_recorder
from magenta.models.onsets_frames_transcription.realtime import tflite_model
'''


from flask import Flask
app = Flask(__name__, static_url_path='', static_folder=os.path.abspath('../static'))
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


@app.route('/predict', methods=['POST'])
def predict():
    print('predicting.....')
    now = time.time()
    values = json.loads(request.data)
    print('creating midi data', values)
    valuesStr = (''.join(chr(v) for v in values))
    valBytes = BytesIO(bytes(valuesStr, 'latin1'))
    midi_data = pretty_midi.PrettyMIDI(valBytes)
    # print('setting duration')
    duration = float(request.args.get('duration'))
    print('setting retMidi')
    ret_midi = generate_midi(midi_data, 10)
    return send_file(ret_midi, attachment_filename='return.mid',
        mimetype='audio/midi', as_attachment=True)


@app.route('/predict_raw', methods=['POST'])
def predict_raw():
    print('GOT.....')
    print(type(request.data))
    print('audio_data' in request.files)
    audio_data = request.files.get('audio_data')
    print(audio_data)
    if audio_data:
        print(audio_data.content_length)
        response = app.response_class(
            response=json.dumps({'value': 'OK'}),
            status=200,
            mimetype='application/json'
        )
    else:
        response = app.response_class(
            response=json.dumps({'value': 'No audio data'}),
            status=400,
            mimetype='application/json'
        )

    return response


@app.route('/predict_frames', methods=['POST'])
def predict_frames():
    print('GOT.....')
    ret_midi  = '../assets/genMusic/unconditional.mid'
    values = json.loads(request.data)
    print(values)
    return send_file(ret_midi, attachment_filename='return.mid',
        mimetype='audio/midi', as_attachment=True)

@app.route('/', methods=['GET', 'POST'])
def index():
    return send_file('../static/index.html')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
