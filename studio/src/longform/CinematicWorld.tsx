import React from 'react';
import { interpolate } from 'remotion';

type Props = { location: string; accent: string; frame: number; fps: number; index: number };

/**
 * Layered illustrated city set. The skyline, midground architecture, street plane,
 * practical lights and foreground silhouettes move at different rates for a
 * stronger parallax read while remaining deterministic across renders.
 */
export const CinematicWorld: React.FC<Props> = ({ location, accent, frame, fps, index }) => {
  const t = frame / fps;
  const key = location.toLowerCase();
  const city = key.includes('city') || key.includes('street') || key.includes('rooftop') || key.includes('night');
  const rooftop = key.includes('rooftop');
  const ruins = key.includes('ruin') || key.includes('temple') || key.includes('ancient');
  const interior = key.includes('interior') || key.includes('room') || key.includes('lab');
  const space = key.includes('space') || key.includes('planet') || key.includes('orbit');
  const forest = key.includes('forest') || key.includes('wood');
  const drift = Math.sin(t * 0.28 + index) * 14;
  const pulse = interpolate(Math.sin(t * 1.4), [-1, 1], [0.16, 0.42]);

  const skyline = Array.from({ length: 23 }, (_, i) => {
    const x = i * 91 - 30;
    const w = 58 + ((i * 37) % 34);
    const h = 180 + ((i * 83 + index * 41) % 310);
    return (
      <g key={i} transform={`translate(${x + drift * (i % 2 ? .55 : -.45)} ${690 - h})`}>
        <path d={`M0 18 L${w * .18} 0 H${w * .78} L${w} 18 V${h} H0Z`} fill={i % 4 === 0 ? '#172943' : '#0D1B30'} stroke="#30435D" strokeWidth="2"/>
        <path d={`M${w * .15} 20 V${h - 15} M${w * .82} 20 V${h - 15}`} stroke="#5B6C82" strokeWidth="2" opacity=".22"/>
        {Array.from({length:5},(_,r)=>Array.from({length:2},(_,c)=>(
          <rect key={r+'-'+c} x={10+c*(w*.43)} y={32+r*39} width="10" height="19" rx="2" fill={r%3===0?accent:'#8BC9E8'} opacity={.12+((i+r+c)%4)*.09}/>
        )))}
        {i%5===1 ? <path d={`M${w*.5} 0 V-34`} stroke="#8294AB" strokeWidth="3" opacity=".5"/> : null}
      </g>
    );
  });

  const streetLights = [230, 1690].map((x,i)=>(
    <g key={i} transform={`translate(${x + Math.sin(t*.55+i)*5} 0)`}>
      <path d={`M0 790 V${i===0?430:390} Q0 365 38 365 H76`} stroke="#111C2B" strokeWidth="13" fill="none"/>
      <path d="M66 365 Q82 365 91 379" stroke="#E6EDF5" strokeWidth="8" fill="none"/>
      <ellipse cx="82" cy="390" rx="115" ry="150" fill={accent} opacity=".08" filter={`url(#worldBlur-${index})`}/>
      <path d="M72 375 L92 375 L101 390 L64 390Z" fill="#FFF0B4" opacity=".9"/>
    </g>
  ));

  return (
    <g>
      <defs>
        <linearGradient id={`worldSky-${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={space?'#070A20':forest?'#0C292B':ruins?'#26324C':interior?'#111827':'#09172B'}/>
          <stop offset="58%" stopColor={city?'#203957':'#25334A'}/>
          <stop offset="100%" stopColor="#111B2B"/>
        </linearGradient>
        <linearGradient id={`worldFloor-${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#34465B"/><stop offset="30%" stopColor="#182638"/><stop offset="100%" stopColor="#070C15"/>
        </linearGradient>
        <linearGradient id={`road-${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#25364A"/><stop offset="100%" stopColor="#080D16"/>
        </linearGradient>
        <radialGradient id={`worldGlow-${index}`}><stop stopColor={accent} stopOpacity={pulse}/><stop offset="100%" stopColor={accent} stopOpacity="0"/></radialGradient>
        <filter id={`worldBlur-${index}`}><feGaussianBlur stdDeviation="25"/></filter>
      </defs>

      <rect width="1920" height="1080" fill={`url(#worldSky-${index})`}/>
      <circle cx={space?1440:1480} cy="220" r={space?330:420} fill={`url(#worldGlow-${index})`}/>
      <circle cx="1450" cy="230" r="72" fill={accent} opacity=".18" filter={`url(#worldBlur-${index})`}/>

      {space ? <g opacity=".82">{Array.from({length:110},(_,i)=><circle key={i} cx={(i*197+43)%1920} cy={(i*113+29)%640} r={i%8===0?3:1.5} fill="#EAF3FF" opacity={.25+(i%5)*.12}/>)}</g> : null}
      {forest ? <g>{Array.from({length:20},(_,i)=><g key={i} transform={`translate(${i*115-30} 0)`} opacity={.45+(i%3)*.15}><path d="M0 760 L-78 360 L0 190 L78 360 L34 360 L96 550 L32 520 L85 760Z" fill={i%2?'#102D2C':'#173A37'}/><path d="M0 250 V760" stroke="#52604A" strokeWidth="9" opacity=".3"/></g>)}</g> : null}

      {city ? <g>
        <g opacity=".5">{skyline}</g>
        <path d="M0 690 Q480 660 960 690 T1920 675 V1080 H0Z" fill="#0A1423"/>
        <path d="M0 750 L960 665 L1920 750" stroke="#667D98" strokeWidth="5" opacity=".25" fill="none"/>
        {!rooftop ? <>
          <path d="M0 810 L730 700 L1190 700 L1920 810 V1080 H0Z" fill={`url(#road-${index})`}/>
          <path d="M960 700 L960 1080" stroke="#A7B6C8" strokeWidth="7" strokeDasharray="52 44" opacity=".36"/>
          <path d="M730 700 L230 1080 M1190 700 L1690 1080" stroke="#91A4BA" strokeWidth="5" opacity=".22"/>
          <path d="M0 810 L730 700 M1920 810 L1190 700" stroke={accent} strokeWidth="5" opacity=".25"/>
          {streetLights}
          <g transform={`translate(${960+Math.sin(t*.8)*12} ${780+Math.sin(t*1.2)*3})`}>
            <path d="M-150 0 L-105 -38 H95 L145 0 L155 42 H-160Z" fill="#D7E0EA" stroke="#0A111D" strokeWidth="9"/>
            <path d="M-72 -32 H68 L103 0 H-104Z" fill="#4D7897" stroke="#15263A" strokeWidth="6"/>
            <circle cx="-100" cy="42" r="20" fill="#070B12" stroke="#A8B7C7" strokeWidth="7"/>
            <circle cx="105" cy="42" r="20" fill="#070B12" stroke="#A8B7C7" strokeWidth="7"/>
            <path d="M-148 12 H-125 M130 12 H150" stroke="#FFE6A1" strokeWidth="8"/>
          </g>
          <g transform={`translate(${380+Math.sin(t*.7)*7} 850) scale(.55)`}>
            <path d="M-150 0 L-105 -38 H95 L145 0 L155 42 H-160Z" fill="#E7A84A" stroke="#0A111D" strokeWidth="10"/>
            <path d="M-72 -32 H68 L103 0 H-104Z" fill="#385F7B" stroke="#15263A" strokeWidth="7"/>
            <circle cx="-100" cy="42" r="20" fill="#070B12" stroke="#A8B7C7" strokeWidth="7"/><circle cx="105" cy="42" r="20" fill="#070B12" stroke="#A8B7C7" strokeWidth="7"/>
          </g>
        </> : <>
          <path d="M0 760 H1920 V1080 H0Z" fill="#101D2D"/>
          <path d="M0 760 Q480 700 960 760 T1920 740" stroke={accent} strokeWidth="5" opacity=".35" fill="none"/>
          <path d="M160 760 V680 H470 V760 M1460 760 V670 H1770 V760" fill="#0B1422" stroke="#43566E" strokeWidth="9"/>
          <path d="M230 700 H410 M1530 690 H1700" stroke="#A7B6C8" strokeWidth="5" opacity=".4"/>
        </>}
        <g opacity=".12"><path d="M0 0 L300 0 L750 780 L500 780Z" fill="#9EDBFF"/><path d="M1500 0 H1710 L1300 780 H1150Z" fill={accent}/></g>
      </g> : null}

      {ruins ? <g fill="none" stroke="#8A8C8D" strokeWidth="26" opacity=".65"><path d="M100 760 V390 Q100 260 240 260 Q380 260 380 390 V760"/><path d="M75 390 H405 M80 760 H405"/><path d="M1460 760 V450 Q1460 330 1580 330 Q1700 330 1700 450 V760"/><path d="M1430 450 H1730"/></g> : null}
      {interior ? <g><path d="M180 0 V760 M1740 0 V760 M180 0 L960 250 L1740 0" stroke="#506078" strokeWidth="18" fill="none" opacity=".6"/><path d="M280 0 L960 300 L1640 0" stroke={accent} strokeWidth="5" opacity=".3" fill="none"/><rect x="680" y="330" width="560" height="370" rx="16" fill="#111B2A" stroke="#506078" strokeWidth="12"/><rect x="715" y="365" width="490" height="300" fill={accent} opacity=".08"/></g> : null}
      {space ? <g><circle cx="1430" cy="420" r="185" fill="#1A4A75" stroke="#75C8F5" strokeWidth="7"/><path d="M1260 390 Q1430 300 1600 410 M1290 500 Q1430 570 1570 470" stroke="#A5E5FF" strokeWidth="18" opacity=".3" fill="none"/><ellipse cx="1430" cy="620" rx="350" ry="45" fill="none" stroke={accent} strokeWidth="7" opacity=".45"/></g> : null}

      {!rooftop ? <path d="M0 1020 L340 970 L620 1010 L920 955 L1210 1005 L1550 950 L1920 1000 V1080 H0Z" fill="#050A12" opacity=".86"/> : null}
      <path d="M0 1040 Q480 1000 960 1030 T1920 1010" stroke={accent} strokeWidth="4" opacity=".16" fill="none"/>
      <g opacity=".2">{Array.from({length:28},(_,i)=><circle key={i} cx={(i*173+Math.floor(t*10))%1920} cy={560+((i*97)%380)} r={2+(i%3)} fill={accent}/>)}</g>
    </g>
  );
};
