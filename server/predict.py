
import ctypes.util
from pathlib import Path
import numpy as np
import os
import tensorflow.compat.v1 as tf
import tempfile
from io import BytesIO
import pretty_midi

from tensor2tensor import models
from tensor2tensor import problems
from tensor2tensor.data_generators import text_encoder
from tensor2tensor.utils import decoding
from tensor2tensor.utils import trainer_lib

from magenta.models.score2perf import score2perf
import note_seq

tf.disable_v2_behavior()

print('libraries are sucesfully imported :D')

MODULE_ROOT = Path(__file__).resolve().parent.parent
print(f'Module root: {MODULE_ROOT.absolute()}')
# specifing paths
SF2_PATH = str(MODULE_ROOT / 'assets' / 'soundFonts' / 'Yamaha-C5-Salamander-JNv5.1.sf2')
save_midi_loc = str(MODULE_ROOT / 'assets' / 'genMusic' / 'unconditional.mid')
SAMPLE_RATE = 16000


# Upload a MIDI file and convert to NoteSequence.
def upload_midi():
  return None
  data = list(files.upload().values())
  if len(data) > 1:
    print('Multiple files uploaded; using only one.')
  return note_seq.midi_to_note_sequence(data[0])

# Decode a list of IDs.
def decode(ids, encoder):
  ids = list(ids)
  if text_encoder.EOS_ID in ids:
    ids = ids[:ids.index(text_encoder.EOS_ID)]
  return encoder.decode(ids)

# collections of some of the midi files ( for testing purposes)
filenames = {
    'C major arpeggio': MODULE_ROOT / 'assets' / 'midi' / 'c_major_arpeggio.mid',
    'C major scale':    MODULE_ROOT / 'assets' / 'midi' / 'c_major_scale.mid',
    'Clair de Lune':    MODULE_ROOT / 'assets' / 'midi' / 'clair_de_lune.mid',
}

primer = 'C major scale'  # current selected track


# setting things up and loading the checkpoint
model_name = 'transformer'
hparams_set = 'transformer_tpu'
ckpt_path = str(MODULE_ROOT / 'assets' / 'checkpoints' / 'unconditional_model_16.ckpt')

class PianoPerformanceLanguageModelProblem(score2perf.Score2PerfProblem):
  @property
  def add_eos_symbol(self):
    return True

problem = PianoPerformanceLanguageModelProblem()
unconditional_encoders = problem.get_feature_encoders()

# Set up HParams.
hparams = trainer_lib.create_hparams(hparams_set=hparams_set)
trainer_lib.add_problem_hparams(hparams, problem)
hparams.num_hidden_layers = 16
hparams.sampling_method = 'random'

# Set up decoding HParams.
decode_hparams = decoding.decode_hparams()
decode_hparams.alpha = 0.0
decode_hparams.beam_size = 1

# Create Estimator.
run_config = trainer_lib.create_run_config(hparams)
estimator = trainer_lib.create_estimator(
    model_name, hparams, run_config,
    decode_hparams=decode_hparams)



global targets
global decode_length

def generate_midi(midi_data, total_seconds=10):

    # Create input generator (so we can adjust priming and
    # decode length on the fly).
    def input_generator():
      print('inside input_gen')
      # These values will be changed by subsequent cells.
      while True:
        yield {
            'targets': np.array([targets], dtype=np.int32),
            'decode_length': np.array(decode_length, dtype=np.int32)
        }

    # initializing targets and decoder_length
    targets = []
    decode_length = 0

    # Start the Estimator, loading from the specified checkpoint.
    input_fn = decoding.make_input_fn_from_generator(input_generator())

    unconditional_samples = estimator.predict(
        input_fn, checkpoint_path=ckpt_path)

    # "Burn" one.
    _ = next(unconditional_samples)

    # convert our input midi to note sequence.
    prime_ns = note_seq.midi_io.midi_to_sequence_proto(midi_data)

    # Handle sustain pedal in the primer.
    primer_ns = note_seq.apply_sustain_control_changes(prime_ns)

    targets = unconditional_encoders['targets'].encode_note_sequence(
        primer_ns)

    # Remove the end token from the encoded primer.
    targets = targets[:-1]

    decode_length = max(0, 4096 - len(targets))
    if len(targets) >= 4096:
      print('Primer has more events than maximum sequence length; nothing will be generated.')

    print('generating the continuation of the input midi')
    # Generate sample events.
    sample_ids = next(unconditional_samples)['outputs']

  
    # Decode to NoteSequence.
    midi_filename = decode(
        sample_ids,
        encoder=unconditional_encoders['targets'])
    ns = note_seq.midi_file_to_note_sequence(midi_filename)

    # Append continuation to primer.
    continuation_ns = note_seq.concatenate_sequences([primer_ns, ns])

    # saving our generated music for future reference
    note_seq.sequence_proto_to_midi_file(
        continuation_ns, save_midi_loc)

    print('finished generating.... returning the final file') 

    return save_midi_loc 

print('finished initializing')