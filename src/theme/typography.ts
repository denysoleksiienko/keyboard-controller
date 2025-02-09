import { FontFamily } from '../enums/FontFamily';
import { scale } from '../utils/scaling-utils';
import { mapToPixels } from './utils';

export const fontSizes = {
  xxs: scale(10) as 10,
  xs: scale(12) as 12,
  sm: scale(14) as 14,
  base: scale(16) as 16,
  md: scale(18) as 18,
  lg: scale(20) as 20,
  xl: scale(24) as 24,
  '2xl': scale(30) as 30,
  '3xl': scale(40) as 40,
} as const;

export const lineHeight = {
  xxs: scale(10) as 10,
  xs: scale(12) as 12,
  sm: scale(14) as 14,
  base: scale(16) as 16,
  md: scale(18) as 18,
  lg: scale(20) as 20,
  xl: scale(22) as 22,
  '2xl': scale(24) as 24,
  '3xl': scale(26) as 26,
  '4xl': scale(30) as 30,
  '5xl': scale(32) as 32,
  '6xl': scale(36) as 36,
  '7xl': scale(48) as 48,
} as const;

export const typography = {
  fonts: {
    regular: FontFamily.MulishRegular,
    medium: FontFamily.MulishMedium,
    bold: FontFamily.MulishBold,
    extraBold: FontFamily.MulishBold,
  },
  fontSizes: {
    ...mapToPixels(fontSizes),
  },
  lineHeight: {
    ...mapToPixels(lineHeight),
  },
};
