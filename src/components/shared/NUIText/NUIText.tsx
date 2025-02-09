import styled from '@emotion/native';
import { TextProps } from 'react-native';

type FontFace = 'regular' | 'medium' | 'bold' | 'extra-bold';

export interface INUITextProps extends TextProps {
  fontFace?: FontFace;
}

export function NUIText({ fontFace, ...props }: INUITextProps) {
  return <Text fontFace={fontFace} {...props} />;
}

const Text = styled.Text<{ fontFace?: FontFace }>`
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.primary.text};
  font-size: ${({ theme }) => theme.fontSizes.base};
  ${({ fontFace, theme }) => {
    switch (fontFace) {
      case 'medium':
        return `font-family: ${theme.fonts.medium};`;
      case 'bold':
        return `font-family: ${theme.fonts.bold};`;
      case 'extra-bold':
        return `font-family: ${theme.fonts.extraBold};`;
      default:
        return `font-family: ${theme.fonts.regular};`;
    }
  }};
`;
