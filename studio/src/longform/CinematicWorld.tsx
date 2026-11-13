import React from 'react';
import { interpolate } from 'remotion';

type Props = { location: string; accent: string; frame: number; fps: number; index: number };

/** Layered 2.5D environment art. All motion is deterministic so renders stay reproducible. */
export const CinematicWorld: React.FC<Props> = ({ location, accent, frame, fps, index }) => {
  const t = frame / fps;
  const key = location.toLowerCase();
  const city = key.includes('city') || key.includes('street') || key.includes('rooftop') || key.includes('night');
  const ruins = key.includes('ruin') || key.includes('temple') || key.includes('ancient');
  const interior = key.includes('interior') || key.includes('room') || key.includes('lab');
  const space = key.includes('space') || key.includes('planet') || key.includes('orbit');
  const forest = key.includes('forest') || key.includes('wood');
  const drift = Math.sin(t * 0.35 + index) * 18;
  const pulse = interpolate(Math.sin(t * 1.4), [-1, 1], [0.12, 0.34]);
  const buildings = Array.from({ length: 15 }, (_, i) => {
    const x = i * 145 - 40;
    const h = 180 + ((i * 71 + index * 29) % 250);
    const w = 80 + ((i * 31) % 55);
    return <g key={i} transform={`translate(${x + drift * (i % 2 ? 1 : -1)} ${700 - h})`}>
      <path d={`M0 0 V${h} H${w} V0 L${w * .72} -24 H${w * .25} Z`} fill={i % 3 === 0 ? '#17243A' : '#101A2C'} stroke="#34435C" strokeWidth="3"/>
      {Array.from({ length: 4 }, (_, r) => Array.from({ length: 3 }, (_, c) => <rect key={r + '-' + c} x={12 + c * 23} y={24 + r * 39} width="9" height="17" rx="2" fill={accent} opacity={0.15 + ((i + r + c) % 3) * 0.12}/>))}
      <path d={`M0 ${h - 12} H${w}`} stroke={accent} strokeWidth="3" opacity=".22"/>
    </g>;
  });
  return <g>
    <defs>
      <linearGradient id={`worldSky-${index}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={space ? '#080B24' : forest ? '#102B2D' : ruins ? '#26324C' : interior ? '#111827' : '#10213B'}/><stop offset="100%" stopColor="#25334A"/></linearGradient>
      <linearGradient id={`worldFloor-${index}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#26364A"/><stop offset="100%" stopColor="#080D17"/></linearGradient>
      <radialGradient id={`worldGlow-${index}`}><stop stopColor={accent} stopOpacity={pulse}/><stop offset="100%" stopColor={accent} stopOpacity="0"/></radialGradient>
      <filter id={`worldBlur-${index}`}><feGaussianBlur stdDeviation="24"/></filter>
    </defs>
    <rect width="1920" height="1080" fill={`url(#worldSky-${index})`}/>
    <circle cx={space ? 1440 : 1480} cy="230" r={space ? 340 : 440} fill={`url(#worldGlow-${index})`}/>
    <circle cx="1450" cy="235" r={space ? 95 : 54} fill={accent} opacity=".22" filter={`url(#worldBlur-${index})`}/>
    {space ? <g opacity=".8">{Array.from({length:95},(_,i)=><circle key={i} cx={(i*197+43)%1920} cy={(i*113+29)%610} r={i%7===0?3:1.5} fill="#EAF3FF" opacity={.25+(i%5)*.12}/>)}</g> : null}
    {forest ? <g>{Array.from({length:18},(_,i)=><g key={i} transform={`translate(${i*125-30} 0)`} opacity={.5+(i%3)*.15}><path d="M0 720 L-75 350 L0 210 L75 350 L32 350 L92 510 L30 500 L85 720Z" fill={i%2?'#102D2C':'#173A37'}/><path d="M0 260 V720" stroke="#52604A" strokeWidth="9" opacity=".3"/></g>)}</g> : null}
    {city ? <g>{buildings}<path d="M0 700 Q480 670 960 700 T1920 680 V1080 H0Z" fill="#0B1422" opacity=".72"/><path d="M0 850 L1920 820" stroke={accent} strokeWidth="3" opacity=".25"/></g> : null}
    {ruins ? <g fill="none" stroke="#8A8C8D" strokeWidth="26" opacity=".65"><path d="M100 760 V390 Q100 260 240 260 Q380 260 380 390 V760"/><path d="M75 390 H405 M80 760 H405"/><path d="M1460 760 V450 Q1460 330 1580 330 Q1700 330 1700 450 V760"/><path d="M1430 450 H1730"/></g> : null}
    {interior ? <g><path d="M180 0 V760 M1740 0 V760 M180 0 L960 250 L1740 0" stroke="#506078" strokeWidth="18" fill="none" opacity=".6"/><path d="M280 0 L960 300 L1640 0" stroke={accent} strokeWidth="5" opacity=".3" fill="none"/><rect x="680" y="330" width="560" height="370" rx="16" fill="#111B2A" stroke="#506078" strokeWidth="12"/><rect x="715" y="365" width="490" height="300" fill={accent} opacity=".08"/></g> : null}
    {space ? <g><circle cx="1430" cy="420" r="185" fill="#1A4A75" stroke="#75C8F5" strokeWidth="7"/><path d="M1260 390 Q1430 300 1600 410 M1290 500 Q1430 570 1570 470" stroke="#A5E5FF" strokeWidth="18" opacity=".3" fill="none"/><ellipse cx="1430" cy="620" rx="350" ry="45" fill="none" stroke={accent} strokeWidth="7" opacity=".45"/></g> : null}
    <path d="M0 760 Q380 700 760 770 T1500 735 T1920 770 V1080 H0Z" fill={`url(#worldFloor-${index})`}/>
    <path d="M0 900 Q480 860 960 910 T1920 880" stroke={accent} strokeWidth="4" opacity=".18" fill="none"/>
    <path d="M0 1000 L1920 940" stroke="#AFC6E8" strokeWidth="2" opacity=".08"/>
    <g opacity=".22">{Array.from({length:24},(_,i)=><circle key={i} cx={(i*173+Math.floor(t*12))%1920} cy={570+((i*97)%340)} r={2+(i%3)} fill={accent}/>)}</g>
  </g>;
};
