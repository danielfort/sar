/* eslint-disable no-console */
import React from 'react';
import TrackRow from './TrackRow.js';


const HomePage = () => {
  const tracks = [
    'mm_001.m4a',
    'mm_002.m4a',
    'mm_003.m4a',
    'preaelude.m4a'
  ]

  return (
    <div className='tracks'>
      {
        tracks.map((name,i) => <TrackRow key={i} trackName={name}/>)
      }
    </div>
  )
};

export default HomePage;
