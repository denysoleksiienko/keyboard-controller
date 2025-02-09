import { useMemo } from 'react';
import { useTheme } from '@emotion/react';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import IconArrowRight from '../../assets/icons/IconArrowRight.svg';

interface INUITransformChevron {
  progress?: SharedValue<0 | 1>;
  expanded?: boolean;
  reversed?: boolean;
}

const DEFAULT_ROTATE = 90;

export function NUITransformChevron({
  progress,
  reversed,
  expanded,
}: INUITransformChevron) {
  const { colors } = useTheme();

  const progressValue = useDerivedValue(() => {
    if (expanded != null) {
      return expanded ? 1 : 0;
    }
    return progress?.value || 0;
  });

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progressValue.value * 180}deg` }],
  }));

  const arrowStyle = useMemo(
    () => ({
      transform: [
        { rotate: `${reversed ? -DEFAULT_ROTATE : DEFAULT_ROTATE}deg` },
      ],
    }),
    [reversed],
  );

  return (
    <Animated.View style={iconStyle}>
      <IconArrowRight
        fill={colors.primary.accent}
        height={10}
        style={arrowStyle}
        width={5}
      />
    </Animated.View>
  );
}
