import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Hero } from './Hero';
import { LongformEpisodeData, getDurationInFrames } from './types';

const Scene: React.FC<{ scene: LongformEpisodeData['scenes'][number]; frame: number; fps: number; index: number }> = ({ scene, frame, fps, index }) => {
  const progress = frame / Math.max(1, scene.durationSeconds * fps);
  const fade = Math.min(1, frame / 18, (scene.durationSeconds * fps - frame) / 18);
  const zoom = interpolate(progress, [0, 1], [1.02, 1.09]);
  const cameraX = Math.sin(progress * Math.PI * 2 + index) * 18;
  const heroX = scene.action === 'walk' || scene.action === 'run'
    ? interpolate(progress, [0, 1], [-150, 150])
    : 0;
  const scale = scene.camera === 'close' ? 1.35 : scene.camera === 'medium' ? 1.05 : 0.82;
  return (
    <AbsoluteFill style={{ opacity: Math.max(0, fade), overflow: 'hidden', background: scene.background }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`sky-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={scene.background}/>
            <stop offset="100%" stopColor="#101522"/>
          </linearGradient>
          <radialGradient id={`light-${index}`}><stop offset="0%" stopColor={scene.accent} stopOpacity=".35"/><stop offset="100%" stopColor={scene.accent} stopOpacity="0"/></radialGradient>
        </defs>
        <rect width="1920" height="1080" fill={`url(#sky-${index})`}/>
        <circle cx="1450" cy="210" r="430" fill={`url(#light-${index})`}/>
        <path d="M0 720 Q360 650 700 735 T1400 700 T1920 730 V1080 H0Z" fill="#0A1019" opacity=".75"/>
        <path d="M0 850 Q420 790 900 860 T1920 820 V1080 H0Z" fill="#080B12"/>
        <g transform={`translate(${960 + cameraX} 260) scale(${scale * zoom}) translate(${-heroX} 0)`}>
          <Hero frame={frame} fps={fps} action={scene.action} accent={scene.accent}/>
        </g>
        <path d="M0 930 Q480 900 960 930 T1920 930" stroke={scene.accent} strokeWidth="3" opacity=".18" fill="none"/>
      </svg>
      {scene.title ? <div style={{position:'absolute',left:110,right:110,top:90,color:'#fff',fontFamily:'Arial,sans-serif',fontSize:54,fontWeight:800,textShadow:'0 4px 24px #000',letterSpacing:1}}>{scene.title}</div> : null}
      {scene.subtitle ? <div style={{position:'absolute',left:112,right:180,bottom:95,color:'#E7EAF2',fontFamily:'Arial,sans-serif',fontSize:30,textShadow:'0 3px 18px #000'}}>{scene.subtitle}</div> : null}
      <div style={{position:'absolute',right:70,bottom:55,color:'#FFFFFF66',fontFamily:'Arial,sans-serif',fontSize:18,letterSpacing:4}}>WHAT IF</div>
    </AbsoluteFill>
  );
};

export const LongformEpisode: React.FC<{ episode: LongformEpisodeData }> = ({ episode }) => {
  const frame = useCurrentFrame();
  let cursor = 0;
  for (let i = 0; i < episode.scenes.length; i++) {
    const scene = episode.scenes[i];
    const length = Math.max(1, Math.round(scene.durationSeconds * episode.fps));
    if (frame >= cursor && frame < cursor + length) {
      return <Scene scene={scene} frame={frame - cursor} fps={episode.fps} index={i}/>;
    }
    cursor += length;
  }
  const last = episode.scenes[episode.scenes.length - 1];
  return last ? <Scene scene={last} frame={Math.max(0, Math.round(last.durationSeconds * episode.fps) - 1)} fps={episode.fps} index={episode.scenes.length - 1}/> : <AbsoluteFill style={{background:'#080B12'}}/>;
};

export const longformDuration = getDurationInFrames;
