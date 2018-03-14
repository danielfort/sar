/* eslint-disable no-console */

import React from 'react';
import PropTypes from 'prop-types';
import TrackWave from './TrackWave.js';


export default class TrackRow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playing: true,
      auContext: undefined
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
    this.setState({auContext: audioCtx, analyser:analyser});
  }

  onClickHandler = () => {
    this.setState(previousState => ({ playing: !previousState.playing }));
  }

  render() {
    return (
      <div className='track'>
        <div className='togglePlay' onClick={this.onClickHandler}>
          {this.props.trackName.slice(0, -4)}
        </div>
        <TrackWave
          audioCtx={this.state.auContext}
          analyser={this.state.analyser}
          name={this.props.trackName}
          playing={this.state.playing}
          />
      </div>
    )
  }
}

