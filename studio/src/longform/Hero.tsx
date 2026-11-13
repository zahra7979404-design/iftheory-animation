import React from 'react';
import { interpolate } from 'remotion';

type Action = 'idle' | 'walk' | 'run' | 'jump' | 'point' | 'react';
type Props = { frame: number; fps: number; action: Action; accent: string };

const stroke = (x1:number,y1:number,x2:number,y2:number,width:number=18) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#080A11" strokeWidth={width} strokeLinecap="round" />
);

/** Recurring hero rig: black spherical head, glowing face, yellow hoodie, black cargo pants and black/yellow sneakers. */
export const Hero: React.FC<Props> = ({ frame, fps, action, accent }) => {
  const t = frame / fps;
  const moving = action === 'walk' || action === 'run';
  const speed = action === 'run' ? 1.65 : 1;
  const stride = moving ? Math.sin(t * 7.4 * speed) : 0;
  const legL = stride * (action === 'run' ? 31 : 21);
  const legR = -legL;
  const armL = moving ? -stride * (action === 'run' ? 39 : 27) : action === 'react' ? -48 : 0;
  const armR = action === 'point' ? -58 : moving ? stride * (action === 'run' ? 39 : 27) : action === 'react' ? 48 : 0;
  const jumpPhase = (frame % Math.max(1, fps * 1.8)) / Math.max(1, fps * 1.8);
  const bob = action === 'jump'
    ? -Math.sin(jumpPhase * Math.PI) * 92
    : moving ? -Math.abs(Math.sin(t * 7.4 * speed)) * 10 : Math.sin(t * 2.1) * 2.5;
  const glow = interpolate(Math.sin(t * 2.2), [-1, 1], [0.62, 1]);
  const startled = action === 'react';
  return (
    <g transform={`translate(0 ${bob})`}>
      <defs>
        <linearGradient id="hoodieFabric" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE07A"/><stop offset="48%" stopColor={accent}/><stop offset="100%" stopColor="#C77B13"/>
        </linearGradient>
        <linearGradient id="pantsFabric" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#080A12"/><stop offset="50%" stopColor="#202432"/><stop offset="100%" stopColor="#070910"/>
        </linearGradient>
        <radialGradient id="faceGlow"><stop offset="0%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#BFEAFF" stopOpacity=".28"/></radialGradient>
        <filter id="faceBloom"><feGaussianBlur stdDeviation="8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="softShadow"><feGaussianBlur stdDeviation="10"/></filter>
      </defs>
      {/* grounded contact shadow */}
      <ellipse cx="0" cy="486" rx="82" ry="12" fill="#000" opacity=".35" filter="url(#softShadow)"/>
      {/* legs: fitted black cargo trousers with articulated knees */}
      <g transform={`rotate(${legL} -20 355)`}>
        <path d="M-39 340 L-5 345 L-18 462 L-52 464 L-54 408Z" fill="url(#pantsFabric)" stroke="#03050A" strokeWidth="5"/>
        <path d="M-48 394 L-18 398 L-23 427 L-51 424Z" fill="#171C29" stroke="#34394A" strokeWidth="3"/>
        <path d="M-50 406 L-24 410" stroke="#555B6A" strokeWidth="2" opacity=".5"/>
        <path d="M-60 458 Q-40 450 -13 460 L-5 482 Q-35 490 -67 481Z" fill="#090B12" stroke="#020308" strokeWidth="5"/>
        <path d="M-57 474 Q-34 469 -9 476" stroke="#F4B52C" strokeWidth="8" strokeLinecap="round"/>
        <path d="M-63 484 L-5 484" stroke="#9BA2B3" strokeWidth="3" opacity=".55"/>
      </g>
      <g transform={`rotate(${legR} 20 355)`}>
        <path d="M5 345 L39 340 L54 408 L52 464 L18 462Z" fill="url(#pantsFabric)" stroke="#03050A" strokeWidth="5"/>
        <path d="M18 398 L48 394 L51 424 L23 427Z" fill="#171C29" stroke="#34394A" strokeWidth="3"/>
        <path d="M24 410 L50 406" stroke="#555B6A" strokeWidth="2" opacity=".5"/>
        <path d="M13 460 Q40 450 60 458 L67 481 Q35 490 5 482Z" fill="#090B12" stroke="#020308" strokeWidth="5"/>
        <path d="M9 476 Q34 469 57 474" stroke="#F4B52C" strokeWidth="8" strokeLinecap="round"/>
        <path d="M5 484 L63 484" stroke="#9BA2B3" strokeWidth="3" opacity=".55"/>
      </g>
      {/* arms behind torso; black stick-like limbs remain visible */}
      <g transform={`rotate(${armL} -48 198)`}>
        {stroke(-48,198,-91,292,21)}
        <circle cx="-91" cy="292" r="13" fill="#080A11"/>
      </g>
      <g transform={`rotate(${armR} 48 198)`}>
        {stroke(48,198,94,284,21)}
        <circle cx="94" cy="284" r="13" fill="#080A11"/>
        {action === 'point' ? <path d="M94 284 L111 247" stroke="#080A11" strokeWidth="12" strokeLinecap="round"/> : null}
      </g>
      {/* hood silhouette behind the head */}
      <path d="M-61 153 Q-76 107 -48 82 Q0 45 48 82 Q76 107 61 153 L42 181 L-42 181Z" fill="#D99017" stroke="#A96512" strokeWidth="6"/>
      <path d="M-46 139 Q-48 97 0 86 Q48 97 46 139" fill="none" stroke="#F9C34A" strokeWidth="9" opacity=".8"/>
      {/* hoodie torso, seams, kangaroo pocket and drawstrings */}
      <path d="M-43 154 Q-78 166 -82 220 L-67 355 Q0 382 67 355 L82 220 Q78 166 43 154 L25 143 L-25 143Z" fill="url(#hoodieFabric)" stroke="#A96712" strokeWidth="7" strokeLinejoin="round"/>
      <path d="M-37 174 Q-51 220 -48 291" stroke="#FFF0B2" strokeWidth="5" opacity=".38" fill="none"/>
      <path d="M37 174 Q51 220 48 291" stroke="#8E5413" strokeWidth="5" opacity=".35" fill="none"/>
      <path d="M-20 170 L-12 232 M20 170 L12 232" stroke="#513515" strokeWidth="5" strokeLinecap="round"/>
      <path d="M-37 294 Q0 314 37 294 L29 335 Q0 349 -29 335Z" fill="#D99119" stroke="#A96712" strokeWidth="4"/>
      <path d="M-37 294 Q0 310 37 294" stroke="#FFE08A" strokeWidth="4" fill="none" opacity=".7"/>
      <path d="M-57 224 Q-67 276 -57 322" stroke="#FFE7A2" strokeWidth="3" opacity=".32" fill="none"/>
      {/* spherical black head with consistent white luminous expression */}
      <circle cx="0" cy="43" r="67" fill="#030409" stroke="#1C202C" strokeWidth="6"/>
      <ellipse cx="-23" cy="18" rx="34" ry="17" fill="#FFFFFF" opacity=".035"/>
      <g filter="url(#faceBloom)" opacity={glow}>
        <ellipse cx="-23" cy="36" rx="10" ry={startled ? 17 : 13} fill="url(#faceGlow)"/>
        <ellipse cx="23" cy="36" rx="10" ry={startled ? 17 : 13} fill="url(#faceGlow)"/>
        <path d={startled ? "M-14 75 Q0 91 14 75" : "M-15 72 Q0 84 15 72"} stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" fill="none"/>
      </g>
      {/* black baseball cap tucked beneath the raised hood */}
      <path d="M-56 7 Q-46 -28 0 -30 Q46 -28 56 7 L23 2 L-55 15Z" fill="#080A12" stroke="#252A38" strokeWidth="4"/>
      <path d="M8 0 Q48 -9 67 8 Q48 19 12 12Z" fill="#090B13" stroke="#252A38" strokeWidth="2"/>
      <path d="M-36 -12 Q-5 -24 25 -18" stroke="#596071" strokeWidth="3" opacity=".45" fill="none"/>
    </g>
  );
};
