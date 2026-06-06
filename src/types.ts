export interface CardItem {
  id: number;
  emoji: string;
  category: 'feeling' | 'concern' | 'effort' | 'request' | 'health' | 'note';
  text: string;
  subtext?: string;
  color: 'purple' | 'blue' | 'pink' | 'cyan' | 'rose';
}

export interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
  scale: number;
  rotation: number;
}
