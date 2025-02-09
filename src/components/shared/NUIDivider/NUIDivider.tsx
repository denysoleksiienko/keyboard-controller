import { useTheme } from '@emotion/react';
import { StyleProp, View, ViewProps, type ViewStyle } from 'react-native';

interface INUIDividerProps extends ViewProps {
  height?: number;
  color?: string;
  borderStyle?: ViewStyle['borderStyle'];
  style?: StyleProp<ViewStyle>;
}

export function NUIDivider({
  borderStyle = 'solid',
  color,
  height = 1,
  style,
  ...props
}: INUIDividerProps) {
  const { colors } = useTheme();
  const backgroundColor =
    borderStyle === 'solid' ? colors.primary.border : 'transparent';

  const containerStyle: StyleProp<ViewStyle> = [
    {
      height,
      overflow: 'hidden',
      backgroundColor,
    },
    style,
  ];

  const dividerStyle: StyleProp<ViewStyle> = {
    borderWidth: Number(height),
    borderColor: color ?? colors.primary.border,
    borderStyle,
  };

  return (
    <View {...props} style={containerStyle}>
      <View style={dividerStyle} />
    </View>
  );
}
