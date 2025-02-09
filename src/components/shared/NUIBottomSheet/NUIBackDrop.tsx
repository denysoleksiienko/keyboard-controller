import { useEffect } from 'react';
import { useTheme } from '@emotion/react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  withDelay,
  useSharedValue,
  SharedValue,
} from 'react-native-reanimated';

type NUIBackDropProps = {
  isOpen: SharedValue<boolean> | boolean;
  onClose?: () => void;
  duration?: number;
};

export function NUIBackDrop({
  isOpen,
  onClose,
  duration = 300,
}: NUIBackDropProps) {
  const { colors } = useTheme();
  const internalSharedValue = useSharedValue(false);

  useEffect(() => {
    if (typeof isOpen === 'boolean') {
      internalSharedValue.value = isOpen;
    }
  }, [isOpen, internalSharedValue]);

  const sharedIsOpen =
    typeof isOpen === 'boolean' ? internalSharedValue : isOpen;

  const progress = useDerivedValue(() =>
    withTiming(sharedIsOpen.value ? 0 : 1, { duration }),
  );

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    display: sharedIsOpen.value ? 'flex' : 'none',
    zIndex: sharedIsOpen.value
      ? 1
      : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Animated.View
        style={[
          backdropStyle,
          {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.overlay,
          },
        ]}
      />
    </TouchableWithoutFeedback>
  );
}
