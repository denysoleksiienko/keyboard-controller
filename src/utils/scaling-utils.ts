import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

export const scale = (size: number) =>
  parseFloat(((shortDimension / guidelineBaseWidth) * size).toFixed(2));
export const verticalScale = (size: number) =>
  parseFloat(((longDimension / guidelineBaseHeight) * size).toFixed(2));
export const moderateScale = (size: number, factor = 0.5) =>
  parseFloat((size + (scale(size) - size) * factor).toFixed(2));
export const moderateVerticalScale = (size: number, factor = 0.5) =>
  parseFloat((size + (verticalScale(size) - size) * factor).toFixed(2));

export const s = scale;
export const vs = verticalScale;
export const ms = moderateScale;
export const mvs = moderateVerticalScale;
