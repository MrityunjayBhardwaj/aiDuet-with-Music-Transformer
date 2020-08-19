import pretty_midi
import os
import io
from magenta.music import note_seq 

# TODO: Convert inp to midi

values = [77, 84, 104, 100, 0, 0, 0, 6, 0, 0, 0, 1, 1, 224, 77, 84, 114, 107, 0, 0, 0, 52, 0, 255, 81, 3, 7, 161, 32, 0, 144, 65, 127, 129, 117, 144, 67, 127, 0, 128, 65, 90, 44, 144, 71, 127, 0, 128, 67, 90, 36, 144, 73, 127, 0, 128, 71, 90, 76, 144, 75, 127, 0, 128, 73, 90, 26, 128, 75, 90, 0, 255, 47, 0]


s = (''.join(chr(v) for v in values))
bo = io.BytesIO(bytes(s, 'latin1'))

print(s)

v = pretty_midi.PrettyMIDI(bo)
print(v)
# magenta : 1.2.6
# env : 1.2.9