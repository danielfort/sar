/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';

export default class TrackWave extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      percentLoaded: 0
    };
  }

  static propTypes = {
    audioCtx: PropTypes.object,
    analyser: PropTypes.object,
    name: PropTypes.string,
    soundSource: PropTypes.object,
    playing: PropTypes.bool,
  };

  componentDidMount = () => {
    this.getAudioFile('/releases/'+this.props.name);
  }

  getAudioFile = (_fileURL) => {

    const {
      audioCtx,
      analyser,
      soundSource
    } = this.props;
    const distortion = audioCtx.createWaveShaper();
    const gainNode = audioCtx.createGain();
    const biquadFilter = audioCtx.createBiquadFilter();
    const convolver = audioCtx.createConvolver();
    // const soundSource = audioCtx.createBufferSource();
    const ajaxRequest = new XMLHttpRequest();
          ajaxRequest.addEventListener("progress", this.updateProgress);
          ajaxRequest.open('GET', _fileURL, true);
          ajaxRequest.responseType = 'arraybuffer';
          ajaxRequest.onload = function() {

          const audioData = ajaxRequest.response;
          audioCtx.decodeAudioData(audioData)
            .then(
              function(decodedData) {
                soundSource.buffer = decodedData;
                soundSource.connect(analyser);
                analyser.connect(distortion);
                distortion.connect(biquadFilter);
                biquadFilter.connect(convolver);
                convolver.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                soundSource.connect(audioCtx.destination);
              }
            )
            .catch( function(err) { console.log('Error with decoding audio data: ' + err);})
        };
        ajaxRequest.send();

        this.visualize();
  }

  visualize = () => {
    const canvas = this.canvasRef
    const canvasCtx = this.canvasRef.getContext('2d');
    const {analyser} = this.props;
          analyser.fftSize = 2048;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    let draw = function() {

      requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = '#fff';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#444';
      canvasCtx.beginPath();

      const sliceWidth = WIDTH * 1.0 / bufferLength;
      let x = 0;

      for(var i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * HEIGHT/2;

        if(i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height/2);
      canvasCtx.stroke();
    };
    draw();
  }

  updateProgress = (ev) => {
    if (ev.lengthComputable) {
      var percentComplete = Math.round(ev.loaded / ev.total * 100);
      this.setState({ percentLoaded: percentComplete });
    }
  }

  render() {
    return (
      <canvas
        ref={me => this.canvasRef = me}
        className='visualiser'
        style={{width: this.state.percentLoaded+'%'}}
        height='100'
        />
    )
  }
}
