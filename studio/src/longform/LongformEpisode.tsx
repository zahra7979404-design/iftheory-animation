import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Hero } from './Hero';
import { CinematicWorld } from './CinematicWorld';
import { LongformEpisodeData, getDurationInFrames } from './types';

const Scene: React.FC<{ scene: LongformEpisodeData['scenes'][number]; frame: number; fps: number; index: number }> = ({ scene, frame, fps, index }) => {
  const total = Math.max(1, scene.durationSeconds * fps);
  const progress = Math.min(1, Math.max(0, frame / total));
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [total - 20, total], [1, 0], { extrapolateLeft: 'clamp' });
  const zoom = interpolate(progress, [0, 1], [1.04, scene.camera === 'close' ? 1.17 : 1.1]);
  const cameraX = Math.sin(progress * Math.PI * 2 + index * .7) * 24;
  const cameraY = interpolate(progress, [0, 1], [8, -12]) + Math.sin(progress * Math.PI) * 8;
  const heroX = scene.action === 'walk' || scene.action === 'run'
    ? interpolate(progress, [0, 1], [-190, 190])
    : Math.sin(frame / fps * .5) * 8;
  const scale = scene.camera === 'close' ? 1.38 : scene.camera === 'medium' ? 1.08 : .88;
  const opacity = Math.max(0, Math.min(fadeIn, fadeOut));
  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden', background: '#080D17' }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <g transform={`translate(${cameraX} ${cameraY}) scale(${zoom}) translate(${-cameraX} ${-cameraY})`}>
          <CinematicWorld location={scene.location} accent={scene.accent} frame={frame} fps={fps} index={index}/>
          {/* cinematic atmospheric light beams */}
          <g opacity=".12">
            <path d="M1180 0 L1510 0 L1030 850 L900 850Z" fill={scene.accent}/>
            <path d="M1480 0 L1630 0 L1300 760 L1200 760Z" fill="#FFFFFF"/>
          </g>
          {/* hero remains the same rig in every shot */}
          <g transform={`translate(${960 + cameraX * .35} 265) scale(${scale * zoom}) translate(${-heroX} 0)`}>
            <Hero frame={frame} fps={fps} action={scene.action} accent={scene.accent}/>
          </g>
          {/* foreground depth layer */}
          <path d="M0 1015 Q260 930 520 1000 T1050 985 T1530 1000 T1920 960 V1080 H0Z" fill="#050912" opacity=".62"/>
          <path d="M0 1015 Q260 930 520 1000 T1050 985 T1530 1000 T1920 960" stroke={scene.accent} strokeWidth="3" opacity=".16" fill="none"/>
        </g>
      </svg>
      {scene.title ? <div style={{position:'absolute',left:110,right:110,top:82,color:'#fff',fontFamily:'Arial,sans-serif',fontSize:58,fontWeight:900,textShadow:'0 5px 28px #000',letterSpacing:2}}>{scene.title}</div> : null}
      {scene.subtitle ? <div style={{position:'absolute',left:112,right:180,bottom:92,color:'#E7EAF2',fontFamily:'Arial,sans-serif',fontSize:30,fontWeight:600,textShadow:'0 3px 20px #000'}}>{scene.subtitle}</div> : null}
      <div style={{position:'absolute',right:70,bottom:52,color:'#FFFFFF55',fontFamily:'Arial,sans-serif',fontSize:18,letterSpacing:5}}>WHAT IF</div>
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
  return last ? <Scene scene={last} frame={Math.max(0, Math.round(last.durationSeconds * episode.fps) - 1)} fps={episode.fps} index={episode.scenes.length - 1}/> : <AbsoluteFill style={{background:'#080D17'}}/>;
};

export const longformDuration = getDurationInFrames;
