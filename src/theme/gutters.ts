import { mapToPixels } from './utils';

export const gutters = {
  none: 0,
  xxxs: 4,
  xxs: 6,
  xs: 8,
  sm: 10,
  md: 12,
  base: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 22,
  '4xl': 24,
  '5xl': 28,
  '6xl': 32,
  '7xl': 36,
} as const;

export default { ...mapToPixels(gutters) };
