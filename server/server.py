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
import logging
if sys.version_info.major <= 2:
    from cStringIO import StringIO
else:
    from io import StringIO

from io import BytesIO
import time
import json

from flask import Flask
app = Flask(__name__, static_url_path='', static_folder=os.path.abspath('../static'))
midipath = '../assets/genMusic/'
prime_name = 'prime.mid'
total_midi_name = 'total.mid'
partial_midi_name = 'partial.mid'
session_time= -1


@app.route('/predict', methods=['POST'])
def predict():
    print('predicting.....')
    now = time.time()
    # print(request.data)
    values = json.loads(request.data)
    start_time = float(request.args.get('start_time'))
    if start_time!=0:
        session_time = start_time
        midi_path = midipath + str(session_time)
        os.mkdir(midi_path)
    else:
        midi_path = midipath
    

    # print(values)
    # for v in values:
    #     print(v)
    # midi_data = pretty_midi.PrettyMIDI(StringIO(''.join(chr(v) for v in values)))
    # midi_data = pretty_midi.PrettyMIDI(prime_loc)
    values = json.loads(request.data)
    # print('creating midi data', values)
    valuesStr = (''.join(chr(v) for v in values))
    valBytes = BytesIO(bytes(valuesStr, 'latin1'))
    
    midi_data = pretty_midi.PrettyMIDI(valBytes)
    for note in midi_data.instruments[0].notes:
        note.velocity=64
    
    prime_midi_loc = os.path.join(midi_path,prime_name)
    total_midi_loc = os.path.join(midi_path,total_midi_name)
    partial_midi_loc = os.path.join(midi_path,partial_midi_name)
    
    # if start_time==0:
    #     previous_midi = pretty_midi.PrettyMIDI(total_midi_loc)
    #     first_time = previous_midi.instruments[0].notes[0].start
    #     last_time = previous_midi.instruments[0].notes[-1].end
    #     print('concat midi file')
    #     for note in midi_data.instruments[0].notes:
    #         note.start = note.start + last_time + 0.5
    #         note.end = note.end + last_time + 0.5
    #         previous_midi.instruments[0].notes.append(note)
        
    # else:
    #     previous_midi = midi_data
   
        
    
    # first_time = previous_midi.instruments[0].notes[0].start
    # last_time = previous_midi.instruments[0].notes[-1].end
    # print('first time is')
    # print(first_time)
    # print('last time is')
    # print(last_time)
    # cut_note_index = 0
    # shift_time = 0
    # if last_time -first_time > 30:
    #     print('longer than 30s, cut prime')
    #     for i in range(len(previous_midi.instruments[0].notes)):
    #         if last_time - previous_midi.instruments[0].notes[i].start< 30:
    #             cut_note_index = i
    #             shift_time = previous_midi.instruments[0].notes[cut_note_index].start
    #             print("shift_time is")
    #             print(shift_time)
    #             break
        
    #     previous_midi.instruments[0].notes = previous_midi.instruments[0].notes[i:]
    #     for note in previous_midi.instruments[0].notes:
    #          note.start -= shift_time
    #          note.end -= shift_time

    midi_data.write(prime_midi_loc)
    # print('setting duration')
    # duration = float(request.args.get('duration'))
    print('setting retMidi')
    ret_midi = generate_midi(prime_midi_loc,partial_midi_loc,total_midi_loc)
    return send_file(ret_midi, attachment_filename='return.mid', 
        mimetype='audio/midi', as_attachment=True)


@app.route('/', methods=['GET', 'POST'])
def index():
    return send_file('../static/index.html')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080)
