/* eslint-disable no-console */

import React from 'react';
import PropTypes from 'prop-types';
import TrackWave from './TrackWave.js';


export default class TrackRow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      auContext: undefined,
      started: false,
    };
  }

  static propTypes = {
    trackName: PropTypes.string
  };

  componentWillMount = () => {
    // Audio(this.props.trackName);
    this.createAudioContext();
  }

  createAudioContext = () => {
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let analyser = audioCtx.createAnalyser();
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.85;
    this.setState({
      auContext: audioCtx,
      analyser:analyser,
      soundSource: audioCtx.createBufferSource(),
    });
  }

  togglePlay = () => {
    const {
      playing,
      soundSource,
      auContext,
      started
    } = this.state;

    if (!started) soundSource.start(0);

    this.setState(previousState => ({
      playing: !previousState.playing,
      started: true,
    }));

    if(playing) {
      auContext.suspend();
    } else {
      auContext.resume();
    }
  }

  render() {
    return (
      <div className='track'>
        <div className='togglePlay' onClick={this.togglePlay}>
          {this.props.trackName.slice(0, -4)}
        </div>
        <TrackWave
          audioCtx={this.state.auContext}
          analyser={this.state.analyser}
          soundSource={this.state.soundSource}
          name={this.props.trackName}
          playing={this.state.playing}
          />
      </div>
    )
  }
}

