import React, { ReactElement, useEffect, useState } from 'react';
import styled from '@emotion/native';
import {
  useController,
  Control,
  FieldValues,
  FieldValue,
  Path,
} from 'react-hook-form';
import { LayoutChangeEvent, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { hapticFeedbackTrigger } from '../../../utils/hapticFeedbackTrigger';
import { INUIToggleButtonProps } from '../NUIToggleButton/NUIToggleButton';

interface INUIToggleButtonGroupProps<TFieldValues extends FieldValues> {
  /** The `control` object from `react-hook-form` */
  control: Control<FieldValue<TFieldValues>>;
  /** The name of the field in the form schema */
  id: Path<FieldValue<TFieldValues>>;
  /** The default value of the field in the form schema */
  defaultValue?: string;
  /** Children NUIToggleButton */
  children: ReactElement<INUIToggleButtonProps>[];
  /** Set custom animation duration. Default 300 ms */
  animationDuration?: number;
  /** Style to the container */
  containerStyles?: ViewStyle;
  /** Style to the indicator */
  indicatorStyles?: ViewStyle;
}

const INDICATOR_PADDING = 4;

const calculateIndicatorWidth = (
  containerWidth: number,
  childrenLength: number,
): number => {
  'worklet';

  return (containerWidth - 2 * INDICATOR_PADDING) / childrenLength;
};

export function NUIToggleButtonGroup({
  control,
  id,
  defaultValue,
  children,
  animationDuration = 300,
  containerStyles,
  indicatorStyles,
}: INUIToggleButtonGroupProps<FieldValues>) {
  const { field } = useController({
    control,
    name: id,
    defaultValue,
  });

  const [containerWidth, setContainerWidth] = useState<number>(0);
  const indicatorPosition = useSharedValue<number>(0);

  const handleToggle = (value: string, index: number) => {
    hapticFeedbackTrigger();
    field.onChange(value);
    indicatorPosition.value = withTiming(
      INDICATOR_PADDING +
        index * calculateIndicatorWidth(containerWidth, children.length),
      { duration: animationDuration },
    );
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
    width: calculateIndicatorWidth(containerWidth, children.length),
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  useEffect(() => {
    if (defaultValue) {
      const defaultIndex = children.findIndex(
        (child) => child.props.value === defaultValue,
      );
      if (defaultIndex !== -1) {
        indicatorPosition.value =
          INDICATOR_PADDING +
          defaultIndex *
            calculateIndicatorWidth(containerWidth, children.length);
      }
    }
  }, [defaultValue, containerWidth, children.length, indicatorPosition]);

  return (
    <Container onLayout={onLayout}>
      <ToggleContainer style={[containerStyles]}>
        <AnimatedView style={[animatedIndicatorStyle, indicatorStyles]} />
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              isSelected: field.value === child.props.value,
              onPress: () => handleToggle(child.props.value, index),
            });
          }
          return child;
        })}
      </ToggleContainer>
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ToggleContainer = styled.View`
  width: 100%;
  min-height: 52px;
  flex-direction: row;
  border-radius: 16px;
  align-items: center;
  padding: 4px;
  background-color: ${({ theme }) => theme.colors.primary.background};
`;

const AnimatedView = styled(Animated.View)`
  position: absolute;
  height: 100%;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.primary.white};
`;
