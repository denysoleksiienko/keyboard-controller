import {
  DarkTheme,
  DefaultTheme,
  Theme as NativeTheme,
} from '@react-navigation/native';
import { ms, mvs, s, vs } from '../utils/scaling-utils';
import { colorsDark, colorsLight } from './colors';
import mappedGutters, { gutters } from './gutters';
import { typography, lineHeight, fontSizes } from './typography';

export const lightTheme = {
  colors: colorsLight,
  gutters: mappedGutters,
  ...typography,
  inline: {
    gutters,
    fontSizes,
    lineHeight,
  },
  scale: (size: number) => `${s(size)}px`,
  verticalScale: (size: number) => `${vs(size)}px`,
  moderateScale: (size: number, factor?: number) => `${ms(size, factor)}px`,
  moderateVerticalScale: (size: number, factor?: number) =>
    `${mvs(size, factor)}px`,
  navigationTheme: {
    dark: false,
    fonts: {
      ...DefaultTheme.fonts,
      regular: {
        fontFamily: typography.fonts.regular as string,
        fontWeight: '400',
      },
      medium: {
        fontFamily: typography.fonts.medium as string,
        fontWeight: '500',
      },
      bold: {
        fontFamily: typography.fonts.bold as string,
        fontWeight: '700',
      },
      heavy: {
        fontFamily: typography.fonts.extraBold as string,
        fontWeight: '800',
      },
    } as NativeTheme['fonts'],
    colors: {
      ...DefaultTheme.colors,
      background: colorsLight.primary.background,
      card: colorsLight.primary.white,
      text: colorsLight.primary.neutral,
      border: colorsLight.primary.border,
      statusBar: colorsLight.primary.background,
    },
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: colorsDark,
  navigationTheme: {
    dark: true,
    fonts: lightTheme.fonts,
    colors: {
      ...DarkTheme.colors,
      background: colorsDark.primary.background,
      card: colorsDark.primary.background,
      text: colorsDark.primary.text,
      border: colorsDark.primary.white,
    },
  },
};

export type Theme = typeof lightTheme;
