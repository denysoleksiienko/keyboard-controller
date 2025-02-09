import { useCallback, useEffect } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import {
  Control,
  FieldValue,
  FieldValues,
  Path,
  useController,
} from 'react-hook-form';
import { LayoutChangeEvent, Pressable, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { hapticFeedbackTrigger } from '../../../utils/hapticFeedbackTrigger';

interface ISwitchProps<TFieldValues extends FieldValues> {
  /** The `control` object from `react-hook-form` */
  control: Control<FieldValue<TFieldValues>>;
  /** The name of the field in the form schema */
  id: Path<FieldValue<TFieldValues>>;
  /** Disabled switch */
  disabled?: boolean;
  /** Set custom animation duration. Default 300 ms */
  animationDuration?: number;
  /** Personalization of switcher */
  trackColors?: { on: string; off: string };
  /** Style to the container */
  containerStyles?: ViewStyle;
  /** Style to the thumb */
  thumbStyle?: ViewStyle;
  /** DefaultValue value */
  defaultValue?: boolean;
  /** Enable haptic feedback */
  enabledHapticFeedback?: boolean;
}

const SWITCH_HEIGHT = 32;
const SWITCH_WIDTH = 52;

export function NUISwitch({
  control,
  id,
  disabled = false,
  animationDuration = 300,
  trackColors,
  containerStyles,
  thumbStyle,
  defaultValue = false,
  enabledHapticFeedback = true,
}: ISwitchProps<FieldValues>) {
  const { colors } = useTheme();
  const height = useSharedValue(SWITCH_HEIGHT);
  const width = useSharedValue(SWITCH_WIDTH);
  const isOn = useSharedValue(defaultValue);

  const { field } = useController({
    control,
    name: id,
    disabled,
    defaultValue,
  });

  useEffect(() => {
    isOn.value = field.value;
  }, [field.value, isOn]);

  const handlePress = useCallback(() => {
    const newValue = !isOn.value;
    isOn.value = newValue;
    field.onChange(newValue);
    if (enabledHapticFeedback) {
      hapticFeedbackTrigger();
    }
  }, [enabledHapticFeedback, field, isOn]);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = disabled
      ? colors.primary.background
      : interpolateColor(
          Number(isOn.value),
          [0, 1],
          [
            trackColors?.off || colors.primary.background,
            trackColors?.on || colors.primary.accent,
          ],
        );

    return {
      backgroundColor: withTiming(color, { duration: animationDuration }),
      borderRadius: height.value / 2,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      Number(isOn.value),
      [0, 1],
      [0, width.value - height.value],
    );
    const backgroundColor = withTiming(
      interpolateColor(
        Number(isOn.value),
        [0, 1],
        [colors.primary.accent, colors.primary.white],
      ),
      { duration: animationDuration },
    );

    return {
      transform: [
        { translateX: withTiming(translateX, { duration: animationDuration }) },
      ],
      borderRadius: height.value / 2,
      backgroundColor,
    };
  });

  const onLayout = (event: LayoutChangeEvent) => {
    height.value = event.nativeEvent.layout.height;
    width.value = event.nativeEvent.layout.width;
  };

  return (
    <Pressable disabled={disabled} onPress={handlePress}>
      <AnimatedContainer
        height={SWITCH_HEIGHT}
        onLayout={onLayout}
        style={[trackAnimatedStyle, containerStyles]}
        width={SWITCH_WIDTH}
      >
        <AnimatedThumb style={[thumbAnimatedStyle, thumbStyle]} />
      </AnimatedContainer>
    </Pressable>
  );
}

const AnimatedContainer = styled(Animated.View)<{
  width: number;
  height: number;
}>`
  align-items: flex-start;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  padding: 6px;
`;

const AnimatedThumb = styled(Animated.View)`
  height: 100%;
  aspect-ratio: 1;
`;
