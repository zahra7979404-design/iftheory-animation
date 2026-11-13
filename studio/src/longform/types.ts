export type LongformScene = {
  id: string;
  durationSeconds: number;
  background: string;
  accent: string;
  location: string;
  action: 'idle' | 'walk' | 'run' | 'jump' | 'point' | 'react';
  camera: 'wide' | 'medium' | 'close';
  title?: string;
  subtitle?: string;
};

export type LongformEpisodeData = {
  id: string;
  title: string;
  fps: number;
  width: number;
  height: number;
  scenes: LongformScene[];
};

export const getDurationInFrames = (episode: LongformEpisodeData) =>
  Math.max(1, Math.round(episode.scenes.reduce((sum, scene) => sum + scene.durationSeconds, 0) * episode.fps));
