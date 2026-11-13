import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Hero } from './Hero';
import { CinematicWorld } from './CinematicWorld';
import { LongformEpisodeData, getDurationInFrames } from './types';

const Scene: React.FC<{ scene: LongformEpisodeData['scenes'][number]; frame: number; fps: number; index: number; elapsedBefore: number; episodeSeconds: number }> = ({ scene, frame, fps, index, elapsedBefore, episodeSeconds }) => {
  const total = Math.max(1, scene.durationSeconds * fps);
  const progress = Math.min(1, Math.max(0, frame / total));
  const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [total - 18, total], [1, 0], { extrapolateLeft: 'clamp' });
  // A slow, eased dolly with a restrained lateral track gives each shot a deliberate camera move.
  const eased = progress * progress * (3 - 2 * progress);
  const close = scene.camera === 'close';
  const zoom = interpolate(eased, [0, 1], [close ? 1.15 : 1.025, close ? 1.34 : 1.105]);
  const panX = interpolate(eased, [0, 1], [index % 2 ? 19 : -24, index % 2 ? -30 : 26]);
  const panY = interpolate(eased, [0, 1], [10, -13]) + Math.sin(progress * Math.PI) * 7;
  const drift = Math.sin(frame / fps * .42 + index) * 2.2;
  const heroX = scene.action === 'walk' || scene.action === 'run'
    ? interpolate(eased, [0, 1], [-210, 210])
    : Math.sin(frame / fps * .65) * 7;
  const scale = close ? 1.38 : scene.camera === 'medium' ? 1.08 : .88;
  const opacity = Math.max(0, Math.min(fadeIn, fadeOut));
  const shake = scene.action === 'run' ? Math.sin(frame * .9) * 1.6 : 0;
  return (
    <AbsoluteFill style={{ opacity, overflow: 'hidden', background: '#080D17' }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`vignette-${index}`}><stop offset="48%" stopColor="#02040A" stopOpacity="0"/><stop offset="100%" stopColor="#02040A" stopOpacity=".78"/></radialGradient>
          <linearGradient id={`topShade-${index}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#02040A" stopOpacity=".45"/><stop offset="100%" stopColor="#02040A" stopOpacity="0"/></linearGradient>
        </defs>
        <g transform={`translate(${panX + drift + shake} ${panY}) scale(${zoom})`}>
          <CinematicWorld location={scene.location} accent={scene.accent} frame={frame} fps={fps} index={index}/>
          {scene.id === 'gravity-break' || scene.id === 'city-chaos' ? (
            <g fill="none" stroke={scene.accent} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
              <g transform={`translate(${250 + Math.sin(frame / 13) * 18} ${610 - (frame * 2.8) % 270}) rotate(-12)`}>
                <path d="M-105 0 L-75 -42 H55 L95 -8 L115 20 H-115Z" fill="#DCE5F2" stroke="#182338" strokeWidth="8"/>
                <path d="M-45 -36 H45 L70 -5 H-65Z" fill="#6CA6C8" stroke="#182338" strokeWidth="5"/>
                <circle cx="-65" cy="22" r="17" fill="#111827" stroke="#AAB8C8" strokeWidth="7"/>
                <circle cx="70" cy="22" r="17" fill="#111827" stroke="#AAB8C8" strokeWidth="7"/>
              </g>
              <g transform={`translate(${1450 + Math.sin(frame / 17) * 28} ${650 - (frame * 3.5) % 340}) rotate(18)`}>
                <path d="M0 -80 V80 M-42 -35 L0 -80 L42 -35 M-42 35 L0 80 L42 35" stroke="#F4B52C" strokeWidth="12"/>
                <rect x="-34" y="-18" width="68" height="36" rx="7" fill="#F4B52C" stroke="#17243A" strokeWidth="7"/>
              </g>
              {Array.from({length:9},(_,i)=>(
                <g key={i} transform={`translate(${420 + i*132 + Math.sin(frame/11+i)*22} ${720 - ((frame*2.1+i*67)%430)}) rotate(${i*31+frame*.7})`}>
                  <rect x="-17" y="-17" width="34" height="34" rx="5" fill={i%2 ? '#9AA9BC' : scene.accent} stroke="#17243A" strokeWidth="5"/>
                </g>
              ))}
            </g>
          ) : null}
          {scene.id === 'gravity-returns' ? (
            <g fill={scene.accent} opacity=".9">
              {Array.from({length:8},(_,i)=>(
                <g key={i} transform={`translate(${300+i*185} ${180+((frame*5+i*93)%520)}) rotate(${i*19})`}>
                  <rect x="-12" y="-12" width="24" height="24" rx="4" stroke="#17243A" strokeWidth="4"/>
                </g>
              ))}
            </g>
          ) : null}

          {/* layered atmospheric shafts, kept subtle so the character remains the focal point */}
          <g opacity=".105">
            <path d="M1180 0 L1510 0 L1030 850 L900 850Z" fill={scene.accent}/>
            <path d="M1480 0 L1630 0 L1300 760 L1200 760Z" fill="#FFFFFF"/>
          </g>
          <g transform={`translate(${960 + panX * .35} 265) scale(${scale * zoom}) translate(${-heroX} 0)`}>
            <Hero frame={frame} fps={fps} action={scene.action} accent={scene.accent}/>
          </g>
          {/* foreground silhouette creates a stronger sense of depth */}
          <path d="M0 1015 Q260 930 520 1000 T1050 985 T1530 1000 T1920 960 V1080 H0Z" fill="#050912" opacity=".68"/>
          <path d="M0 1015 Q260 930 520 1000 T1050 985 T1530 1000 T1920 960" stroke={scene.accent} strokeWidth="3" opacity=".2" fill="none"/>
        </g>
        <rect width="1920" height="1080" fill={`url(#vignette-${index})`}/>
        <rect width="1920" height="250" fill={`url(#topShade-${index})`}/>
      </svg>
      {/* Diegetic science HUD: live readouts that change with the story beat. */}
      {(() => {
        const elapsed = Math.max(0, Math.floor(elapsedBefore + frame / fps));
        const gravity = scene.id === 'opening' || scene.id === 'gravity-returns' ? '9.81' : '0.00';
        const status = scene.id === 'opening' ? 'NORMAL' : scene.id === 'gravity-returns' ? 'RESTORED' : 'ZERO-G';
        const remaining = Math.max(0, episodeSeconds - elapsed);
        const panel = { background:'rgba(4,12,27,.78)', border:'1px solid rgba(102,210,255,.72)', boxShadow:'0 0 22px rgba(38,164,255,.16), inset 0 0 18px rgba(38,164,255,.08)', borderRadius:10, padding:'13px 18px', color:'#DDF6FF', fontFamily:'Arial,sans-serif', letterSpacing:2, backdropFilter:'blur(8px)' } as const;
        const label = { fontSize:13, color:'#79DFFF', fontWeight:800, letterSpacing:3 } as const;
        const value = { fontSize:29, color:status === 'OFFLINE' ? '#FF667B' : '#FFE08A', fontWeight:900, marginTop:5, textShadow:'0 0 14px currentColor' } as const;
        return <>
          <div style={{position:'absolute',left:64,top:54,minWidth:250,...panel}}>
            <div style={label}>GRAVITY MONITOR</div>
            <div style={value}>{gravity} <span style={{fontSize:14}}>m/s²</span></div>
            <div style={{fontSize:12,marginTop:5,color:status==='OFFLINE'?'#FF7184':'#8CF0C6'}}>SYSTEM: {status}</div>
          </div>
          <div style={{position:'absolute',right:64,top:54,minWidth:180,textAlign:'right',...panel}}>
            <div style={label}>EVENT TIMER</div>
            <div style={{fontSize:34,fontWeight:900,color:'#FF6A78',fontVariantNumeric:'tabular-nums',textShadow:'0 0 18px #FF304F'}}>{'00:'+String(remaining).padStart(2,'0')}</div>
            <div style={{fontSize:11,color:'#A9C6D9',marginTop:2}}>SECONDS REMAINING</div>
          </div>
          <div style={{position:'absolute',right:64,bottom:118,minWidth:205,...panel}}>
            <div style={label}>ELAPSED TIME</div>
            <div style={{...value,color:'#8DE7FF'}}>{String(elapsed).padStart(2,'0')} <span style={{fontSize:14}}>sec</span></div>
            <div style={{fontSize:11,color:'#A9C6D9',marginTop:3}}>EVENT TIMELINE</div>
          </div>
          <div style={{position:'absolute',left:64,bottom:118,width:230,height:5,background:'rgba(120,190,220,.2)',borderRadius:5,overflow:'hidden'}}>
            <div style={{width:(Math.min(1,elapsed/Math.max(1,episodeSeconds))*100)+'%',height:'100%',background:'linear-gradient(90deg,#39C8FF,#FFE08A)',boxShadow:'0 0 12px #39C8FF'}}/>
          </div>
        </>;
      })()}
      {scene.title ? <div style={{position:'absolute',left:110,right:110,top:76,color:'#fff',fontFamily:'Arial,sans-serif',fontSize:58,fontWeight:900,textShadow:'0 5px 28px #000',letterSpacing:2}}>{scene.title}</div> : null}
      {scene.subtitle ? <div style={{position:'absolute',left:112,right:180,bottom:90,color:'#E7EAF2',fontFamily:'Arial,sans-serif',fontSize:30,fontWeight:600,textShadow:'0 3px 20px #000'}}>{scene.subtitle}</div> : null}
      <div style={{position:'absolute',left:0,right:0,top:0,height:24,background:'#020307',opacity:.68}}/>
      <div style={{position:'absolute',left:0,right:0,bottom:0,height:24,background:'#020307',opacity:.68}}/>
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
      return <Scene scene={scene} frame={frame - cursor} fps={episode.fps} index={i} elapsedBefore={cursor / episode.fps} episodeSeconds={episode.scenes.reduce((sum, item) => sum + item.durationSeconds, 0)}/>;
    }
    cursor += length;
  }
  const last = episode.scenes[episode.scenes.length - 1];
  return last ? <Scene scene={last} frame={Math.max(0, Math.round(last.durationSeconds * episode.fps) - 1)} fps={episode.fps} index={episode.scenes.length - 1} elapsedBefore={Math.max(0, (episode.scenes.slice(0, -1).reduce((sum, item) => sum + item.durationSeconds, 0)))} episodeSeconds={episode.scenes.reduce((sum, item) => sum + item.durationSeconds, 0)}/> : <AbsoluteFill style={{background:'#080D17'}}/>;
};

export const longformDuration = getDurationInFrames;
