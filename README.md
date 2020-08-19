## A.I. Duet with Music Transformer

A piano that responds to you.

## About

This is the port of ai-duet experiment by google: https://github.com/googlecreativelab/aiexperiments-ai-duet where, instead of using performanceRNN we are using ![Music Transformer](https://magenta.tensorflow.org/music-transformer)

This is not an official Google product.

## CREDITS from original repo

The original ai-duet experiment was Built by [Yotam Mann](https://github.com/tambien) with friends on the Magenta and Creative Lab teams at Google. It uses [TensorFlow](https://tensorflow.org), [Tone.js](https://github.com/Tonejs/Tone.js) and open-source tools from the [Magenta](https://magenta.tensorflow.org/) project. Check out more at [A.I. Experiments](https://aiexperiments.withgoogle.com).

### INSTALLATION

-> Clone this repo in your desired folder
```bash
git clone https://github.com/MrityunjayBhardwaj/aiDuet-with-Music-Transformer.git
```

-> Create and activating a virtual environment ( or use the existing one if you are feeling adventurous :P )

    if you are using conda then you can simply run this command :-

    ```bash
    conda create --name myenv python=3.7.7
    ```

    this will create a new virtual environment called myenv with python=3.7.7 preinstalled

    after that, you can activate this virtual environment by simply running this command:

    ```bash
    conda activate myenv
    ```

-> for installing the rest of the dependencies :- simply go to the sever folder and install all the dependencies from requirements.txt

```bash
 cd server
 pip install -r requirements.txt
```

-> the checkpoints for music Transformer can be found here:-

    ```bash
    gsutil -q -m cp -r gs://magentadata/models/music_transformer/primers/* ./assets/checkpoints
    ```

    also, soundFont can be fetched using "gsutil" as well:

    ```bash
    gsutil -q -m cp gs://magentadata/soundfonts/Yamaha-C5-Salamander-JNv5.1.sf2 ./assets/soundFonts
    ```


-> Then finally, to build and install the front-end Javascript code, first make sure you have [Node.js](https://nodejs.org) 6 installed. And then install of the dependencies of the project and build the code by typing the following in the terminal: 


```bash
cd static
npm install
npm run build
```




You can then play with A.I. Duet at [localhost:8080](http://localhost:8080).


## MIDI SUPPORT

The A.I. Duet supports MIDI keyboard input using [Web Midi API](https://webaudio.github.io/web-midi-api/) and the [WebMIDI](https://github.com/cotejp/webmidi) library. 

## PIANO KEYBOARD

The piano can also be controlled from your computer keyboard thanks to [Audiokeys](https://github.com/kylestetz/AudioKeys). The center row of the keyboard is the white keys.

## AUDIO SAMPLES

Multisampled piano from [Salamander Grand Piano V3](https://archive.org/details/SalamanderGrandPianoV3) by Alexander Holm ([Creative Commons Attribution 3.0](https://creativecommons.org/licenses/by/3.0/)).

String sounds from [MIDI.js Soundfonts](https://github.com/gleitz/midi-js-soundfonts) generated from [FluidR3_GM.sf2](http://www.musescore.org/download/fluid-soundfont.tar.gz) ([Creative Commons Attribution 3.0](https://creativecommons.org/licenses/by/3.0/)).

## LICENSE from the original repo

Copyright 2016 Google Inc.
s
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
