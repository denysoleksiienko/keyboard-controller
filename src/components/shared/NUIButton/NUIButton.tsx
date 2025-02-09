import {ReactNode, useCallback} from 'react';
import styled from '@emotion/native';
import {useTheme} from '@emotion/react';
import {Pressable, PressableProps} from 'react-native';
import {NUIText} from '../NUIText/NUIText';

type Variant = 'accent' | 'neutral' | 'warning' | 'background' | 'accent-light';

export interface INUIButtonProps extends PressableProps {
  title?: string;
  size?: number;
  loading?: boolean;
  children?: ReactNode;
  variant?: Variant;
  titleSize?: number;
  iconLeft?: ReactNode;
}

export function NUIButton({
  loading,
  size = 56,
  title,
  children,
  disabled,
  variant = 'accent',
  titleSize,
  iconLeft,
  ...props
}: INUIButtonProps) {
  const {colors} = useTheme();

  const getBackgroundColor = useCallback(
    (v: Variant, pressed: boolean, disable: boolean) => {
      if (disable) {
        return colors.neutral['30'];
      }

      switch (v) {
        case 'accent':
          return pressed ? colors.accent['110'] : colors.primary.accent;
        case 'neutral':
          return pressed ? colors.neutral['110'] : colors.neutral['120'];
        case 'warning':
          return pressed ? colors.warning['80'] : colors.primary.warning;
        case 'background':
          return pressed ? colors.neutral['10'] : colors.primary.background;
        case 'accent-light':
          return pressed ? colors.accent['30'] : colors.accent['20'];
        default:
          return colors.primary.accent;
      }
    },
    [colors],
  );

  const getTextColor = useCallback(
    (v: Variant, disable: boolean) => {
      if (disable) {
        return colors.primary.white;
      }

      switch (v) {
        case 'accent':
          return colors.primary.white;
        case 'neutral':
          return colors.primary.accent;
        case 'warning':
          return colors.primary.white;
        case 'background':
          return colors.primary.accent;
        case 'accent-light':
          return colors.primary.accent;
        default:
          return colors.primary.white;
      }
    },
    [colors],
  );

  return (
    <Pressable disabled={disabled} {...props}>
      {({pressed}) => (
        <SolidView
          backgroundColor={getBackgroundColor(variant, pressed, !!disabled)}
          size={size}>
          {children || (
            <Row>
              {iconLeft && <IconLeftContainer>{iconLeft}</IconLeftContainer>}
              <Title
                color={getTextColor(variant, !!disabled)}
                fontSize={titleSize}>
                {title}
              </Title>
            </Row>
          )}
        </SolidView>
      )}
    </Pressable>
  );
}

const SolidView = styled.View<{
  size?: number;
  backgroundColor: string;
}>`
  width: 100%;
  height: ${({size}) => `${size}px`};
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  background-color: ${({backgroundColor}) => backgroundColor};
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const IconLeftContainer = styled.View`
  position: absolute;
  left: 16px;
  right: 0;
`;

const Title = styled(NUIText)<{color: string; fontSize?: number}>`
  font-family: ${({theme}) => theme.fonts.extraBold};
  color: ${({color}) => color};
  ${({fontSize}) => fontSize && `font-size: ${fontSize}px;`}
`;
