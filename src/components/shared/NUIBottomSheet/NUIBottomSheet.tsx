import {
  forwardRef,
  useImperativeHandle,
  useCallback,
  ReactNode,
  useState,
} from 'react';
import styled from '@emotion/native';
import {useTheme} from '@emotion/react';
import {
  Dimensions,
  LayoutChangeEvent,
  Platform,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IconCross from '../../../assets/icons/IconCross.svg';

import {NUIBackDrop} from './NUIBackDrop';
import {statusBarHeight} from '../../../utils/native-utils';
import {NUIPortal} from '../../portal';
import {NUISubTextH3} from '../../elements/typography';

type NUIBottomSheetProps = {
  children: ReactNode;
  title: string;
  onCloseRequest?: () => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export interface INUIBottomSheetMethods {
  expand: () => void;
  close: () => void;
}

const {height: windowHeight} = Dimensions.get('window');

const BOTTOM_PADDING = 20;

export const NUIBottomSheet = forwardRef<
  INUIBottomSheetMethods,
  NUIBottomSheetProps
>(({children, title, onCloseRequest, contentContainerStyle}, ref) => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const [contentHeight, setContentHeight] = useState(0);

  const isOpen = useSharedValue(false);
  const translateY = useSharedValue(windowHeight);

  const expand = useCallback(() => {
    isOpen.value = true;
    translateY.value = withTiming(windowHeight - contentHeight, {});
  }, [contentHeight, isOpen, translateY]);

  const close = useCallback(() => {
    isOpen.value = false;
    translateY.value = withTiming(windowHeight, {}, finished => {
      'worklet';

      if (finished && onCloseRequest) {
        runOnJS(onCloseRequest)();
      }
    });
  }, [isOpen, onCloseRequest, translateY]);

  useImperativeHandle(
    ref,
    () => ({
      expand,
      close,
    }),
    [expand, close],
  );

  const animationStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const handleContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const {height} = event.nativeEvent.layout;

      const bottom = Platform.select({
        ios: height + (insets.bottom || BOTTOM_PADDING),
        default: height + statusBarHeight + BOTTOM_PADDING,
      });

      setContentHeight(bottom);
    },
    [insets.bottom],
  );

  return (
    <NUIPortal isTop>
      <NUIBackDrop isOpen={isOpen} onClose={close} />
      <BottomSheetContainer
        onLayout={handleContentLayout}
        style={[animationStyle, {backgroundColor: colors.primary.neutral}]}>
        <BottomSheetHeader>
          <BottomSheetTitle>{title}</BottomSheetTitle>
          <TouchableOpacity onPress={close}>
            <IconCross fill={colors.neutral['80']} height={14} width={14} />
          </TouchableOpacity>
        </BottomSheetHeader>
        <BottomSheetHeaderSeparator />
        <BottomSheetContent style={contentContainerStyle}>
          {children}
        </BottomSheetContent>
      </BottomSheetContainer>
    </NUIPortal>
  );
});

NUIBottomSheet.displayName = 'NUIBottomSheet';

const BottomSheetContainer = styled(Animated.View)`
  border-radius: 30px;
  padding: 12px 20px 20px;
  margin: 0 16px 40px;
  z-index: 999;
`;

const BottomSheetTitle = styled(NUISubTextH3)`
  color: ${({theme}) => theme.colors.primary.white};
`;

const BottomSheetHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BottomSheetHeaderSeparator = styled.View`
  flex: 1;
  border-bottom-width: 1px;
  margin: 12px -20px 16px;
  border-bottom-color: ${({theme}) => theme.colors.neutral['110']};
`;

const BottomSheetContent = styled.View`
  flex-grow: 1;
`;
