import { ReactNode } from 'react';
import styled from '@emotion/native';
import { TouchableWithoutFeedback } from 'react-native';
import { NUIText } from '../../shared/NUIText/NUIText';

export interface INUIToggleButtonProps {
  // eslint-disable-next-line react/no-unused-prop-types
  value: string;
  children: ReactNode;
  isSelected?: boolean;
  onPress?: () => void;
}

export function NUIToggleButton({
  children,
  isSelected,
  onPress,
}: INUIToggleButtonProps) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <OptionView>
        <OptionTitle fontFace="bold" isSelected={isSelected}>
          {children}
        </OptionTitle>
      </OptionView>
    </TouchableWithoutFeedback>
  );
}

const OptionView = styled.View`
  flex: 1;
  min-height: 52px;
  justify-content: center;
  align-items: center;
`;

const OptionTitle = styled(NUIText)<{ isSelected?: boolean }>`
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.primary.neutral : theme.colors.primary.accent};
`;
