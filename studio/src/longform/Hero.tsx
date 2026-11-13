import React from 'react';
import { interpolate } from 'remotion';

type Action = 'idle' | 'walk' | 'run' | 'jump' | 'point' | 'react';
type Props = { frame: number; fps: number; action: Action; accent: string };

const line = (x1:number,y1:number,x2:number,y2:number,width:number=18) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#101018" strokeWidth={width} strokeLinecap="round" />
);

/** Original recurring hero. Keep all proportions and costume details centralized here. */
export const Hero: React.FC<Props> = ({ frame, fps, action, accent }) => {
  const t = frame / fps;
  const walking = action === 'walk' || action === 'run';
  const speed = action === 'run' ? 1.8 : 1;
  const swing = walking ? Math.sin(t * 7 * speed) * (action === 'run' ? 34 : 23) : 0;
  const bob = action === 'jump'
    ? -Math.sin(Math.min(1, (frame % (fps * 2)) / (fps * 2)) * Math.PI) * 90
    : walking ? Math.abs(Math.sin(t * 7 * speed)) * -9 : Math.sin(t * 2) * 3;
  const point = action === 'point';
  const startled = action === 'react';
  const armAngle = point ? -65 : startled ? -115 : swing;
  const legL = walking ? swing : 0;
  const legR = walking ? -swing : 0;
  const scale = action === 'run' ? 1.02 : 1;
  const glow = interpolate(Math.sin(t * 2), [-1, 1], [0.35, 0.75]);
  return (
    <g transform={`translate(0 ${bob}) scale(${scale})`}>
      <defs>
        <radialGradient id="heroEyeGlow"><stop offset="0%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#BFEAFF" stopOpacity="0.2"/></radialGradient>
        <filter id="heroGlow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* legs and signature black/yellow sneakers */}
      <g transform={`rotate(${legL} 0 365)`}>
        {line(-8,350,-28,470,20)}
        <path d="M -55 470 Q -58 454 -35 452 L -7 458 L 2 480 L -56 480 Z" fill="#11121A" stroke="#050509" strokeWidth="5"/>
        <path d="M -51 470 L -8 470" stroke={accent} strokeWidth="8" strokeLinecap="round"/>
      </g>
      <g transform={`rotate(${legR} 0 365)`}>
        {line(8,350,30,470,20)}
        <path d="M 4 458 L 34 452 Q 58 454 55 470 L 56 480 L 0 480 Z" fill="#11121A" stroke="#050509" strokeWidth="5"/>
        <path d="M 10 470 L 51 470" stroke={accent} strokeWidth="8" strokeLinecap="round"/>
      </g>
      {/* arms behind hoodie */}
      <g transform={`rotate(${-armAngle} -42 205)`}>{line(-42,205,-90,300,18)}<circle cx="-90" cy="300" r="13" fill="#090910"/></g>
      <g transform={`rotate(${armAngle} 42 205)`}>{line(42,205,92,300,18)}<circle cx="92" cy="300" r="13" fill="#090910"/></g>
      {/* yellow hoodie, black drawstrings */}
      <path d="M -48 160 Q -83 174 -82 226 L -65 365 Q 0 390 65 365 L 82 226 Q 83 174 48 160 L 25 148 L -25 148 Z" fill={accent} stroke="#B87516" strokeWidth="7"/>
      <path d="M -38 155 Q -35 105 0 105 Q 35 105 38 155 L 27 178 L -27 178 Z" fill="#E7A51C" stroke="#B87516" strokeWidth="6"/>
      <path d="M -14 180 L -8 236 M 14 180 L 8 236" stroke="#5B3A14" strokeWidth="5" strokeLinecap="round"/>
      <path d="M -25 285 Q 0 300 25 285" stroke="#B87516" strokeWidth="4" fill="none"/>
      {/* perfectly round black head and glowing white face */}
      <circle cx="0" cy="42" r="66" fill="#050509" stroke="#191923" strokeWidth="5"/>
      <g filter="url(#heroGlow)" opacity={glow}>
        <ellipse cx="-23" cy="35" rx="10" ry={startled ? 17 : 13} fill="url(#heroEyeGlow)"/>
        <ellipse cx="23" cy="35" rx="10" ry={startled ? 17 : 13} fill="url(#heroEyeGlow)"/>
        <path d={startled ? "M -13 68 Q 0 88 13 68" : "M -14 70 Q 0 82 14 70"} stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" fill="none"/>
      </g>
      {/* black cap under the hood */}
      <path d="M -53 5 Q -44 -27 0 -28 Q 45 -27 54 5 L 22 0 L -54 12 Z" fill="#090A10" stroke="#242530" strokeWidth="4"/>
      <path d="M 12 -2 Q 48 -8 65 7 Q 45 17 13 10 Z" fill="#090A10"/>
    </g>
  );
};
