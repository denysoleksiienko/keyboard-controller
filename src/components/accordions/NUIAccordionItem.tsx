import React, { useCallback, useEffect } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

type EasingFunction = (amount: number) => number;

interface INUIAccordionItemProps {
  expanded: boolean;
  easing?: EasingFunction;
  children: React.ReactNode;
  duration?: number;
  spacing?: number;
  styles?: ViewStyle;
}

export function NUIAccordionItem({
  expanded = false,
  duration = 300,
  easing,
  children,
  styles,
  spacing = 0,
}: INUIAccordionItemProps) {
  const animatedHeight = useSharedValue(0);
  const contentHeight = useSharedValue(0);

  const toggleAnimationValue = useCallback(
    (value: boolean) => {
      if (value) {
        animatedHeight.value = withTiming(1, {
          duration,
          easing: easing || Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      } else {
        animatedHeight.value = withTiming(0, {
          duration,
          easing: easing || Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      }
    },
    [animatedHeight, duration, easing],
  );

  const animatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animatedHeight.value,
      [0, 1],
      [0, contentHeight.value],
    );
    const marginTop = interpolate(animatedHeight.value, [0, 1], [0, spacing]);
    return {
      height,
      marginTop,
    };
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    contentHeight.value = height;
  };

  useEffect(() => {
    toggleAnimationValue(expanded);
  }, [expanded, toggleAnimationValue]);

  return (
    <Animated.View
      style={[{ width: '100%', overflow: 'hidden' }, animatedStyle, styles]}
    >
      <View
        onLayout={handleLayout}
        style={{ position: 'absolute', width: '100%' }}
      >
        {children}
      </View>
    </Animated.View>
  );
}
