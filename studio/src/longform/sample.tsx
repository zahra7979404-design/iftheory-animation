import React from 'react';
import { LongformEpisode } from './LongformEpisode';
import { LongformEpisodeData } from './types';

export const longformSample: LongformEpisodeData = {
  id: 'LongformSample',
  title: 'Long-form animation engine preview',
  fps: 30,
  width: 1920,
  height: 1080,
  scenes: [
    { id:'opening', durationSeconds:15, background:'#15233D', accent:'#F4B52C', location:'night city', action:'react', camera:'wide', title:'WHAT IF…?', subtitle:'A cinematic long-form story begins here' },
    { id:'discovery', durationSeconds:15, background:'#26334B', accent:'#FFD166', location:'interior', action:'point', camera:'medium', title:'THE DISCOVERY', subtitle:'One strange change starts everything' },
    { id:'consequence', durationSeconds:15, background:'#351E37', accent:'#FF9B54', location:'city street', action:'run', camera:'wide', title:'THE CONSEQUENCES', subtitle:'Every choice creates another reaction' },
    { id:'aftermath', durationSeconds:15, background:'#102C35', accent:'#5EEAD4', location:'rooftop', action:'idle', camera:'close', title:'WHAT HAPPENS NEXT?', subtitle:'A reusable scene system for original stories' }
  ]
};

export const LongformSample: React.FC = () => <LongformEpisode episode={longformSample}/>;
