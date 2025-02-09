import styled from '@emotion/native';
import { NUIText } from '../../shared/NUIText/NUIText';

export const NUITextH1 = styled(NUIText)`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  line-height: ${({ theme }) => theme.lineHeight['6xl']};
  font-family: ${({ theme }) => theme.fonts.extraBold};
`;

export const NUITextH2 = styled(NUIText)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  line-height: ${({ theme }) => theme.lineHeight['3xl']};
  font-family: ${({ theme }) => theme.fonts.extraBold};
`;

export const NUITextH3 = styled(NUIText)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: ${({ theme }) => theme.lineHeight['2xl']};
  font-family: ${({ theme }) => theme.fonts.extraBold};
`;

export const NUITextH4 = styled(NUIText)`
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: ${({ theme }) => theme.lineHeight.lg};
  font-family: ${({ theme }) => theme.fonts.extraBold};
`;

export const NUITextH5 = styled(NUIText)`
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: ${({ theme }) => theme.lineHeight.md};
  font-family: ${({ theme }) => theme.fonts.extraBold};
`;

export const NUITextH6 = styled(NUIText)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeight.base};
  font-family: ${({ theme }) => theme.fonts.extraBold};
`;

export const NUISubTextH1 = styled(NUIText)`
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: ${({ theme }) => theme.lineHeight['3xl']};
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const NUISubTextH2 = styled(NUIText)`
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: ${({ theme }) => theme.lineHeight['2xl']};
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const NUISubTextH3 = styled(NUIText)`
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: ${({ theme }) => theme.lineHeight.xl};
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const NUISubTextH4 = styled(NUIText)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeight.lg};
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const NUISubTextH5 = styled(NUIText)`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeight.md};
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const NUISubTextH6 = styled(NUIText)`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: ${({ theme }) => theme.lineHeight.base};
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const NUISubTextH7 = styled(NUIText)`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  line-height: ${({ theme }) => theme.lineHeight.sm};
  font-family: ${({ theme }) => theme.fonts.bold};
`;
