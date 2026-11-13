import React from 'react';
import { LongformEpisode } from './LongformEpisode';
import { LongformEpisodeData } from './types';

// A complete 60-second visual premise: gravity disappears, then returns.
export const longformSample: LongformEpisodeData = {
  id: 'LongformSample',
  title: 'What If Gravity Disappeared for 60 Seconds?',
  fps: 30,
  width: 1920,
  height: 1080,
  scenes: [
    { id:'opening', durationSeconds:15, background:'#15233D', accent:'#F4B52C', location:'night city', action:'walk', camera:'wide', title:'WHAT IF GRAVITY VANISHED?', subtitle:'An ordinary day. One impossible change.' },
    { id:'gravity-break', durationSeconds:15, background:'#26334B', accent:'#FFD166', location:'city street', action:'react', camera:'medium', title:'THEN… EVERYTHING LETS GO', subtitle:'Cars, signs, and debris begin to rise.' },
    { id:'city-chaos', durationSeconds:15, background:'#351E37', accent:'#FF9B54', location:'city street', action:'run', camera:'wide', title:'THE CITY LOSES CONTROL', subtitle:'One minute without gravity changes everything.' },
    { id:'gravity-returns', durationSeconds:15, background:'#102C35', accent:'#5EEAD4', location:'rooftop', action:'react', camera:'close', title:'AFTER 60 SECONDS…', subtitle:'Gravity returns. The consequences do not disappear.' }
  ]
};

export const LongformSample: React.FC = () => <LongformEpisode episode={longformSample}/>;
