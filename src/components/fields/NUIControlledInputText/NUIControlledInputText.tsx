import {
  forwardRef,
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import styled from '@emotion/native';
import {useTheme} from '@emotion/react';
import {
  Control,
  FieldValue,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {NUIText} from '../../shared/NUIText/NUIText';
import {NUIStoredValuesList} from './NUIStoredValuesList';
import {getValueWithMask} from './utils';

export interface IControlledInputTextProps<TFieldValues extends FieldValues>
  extends TextInputProps {
  /** The `control` object from `react-hook-form` */
  control: Control<FieldValue<TFieldValues>>;
  /** The name of the field in the form schema */
  name: Path<FieldValue<TFieldValues>>;
  /** Style to the container */
  containerStyles?: ViewStyle;
  /** Show a preview of the input to the user */
  hint?: string;
  /** Set the color to the hint */
  hintTextColor?: string;
  /** Value for the label, same as placeholder */
  label: string;
  /** Callback for action submit on the keyboard */
  onSubmit?: () => void;
  /** Style to the input */
  inputStyles?: TextStyle;
  /** Required if onFocus or onBlur is overrided */
  isFocused?: boolean;
  /** Set a mask to the input. Example for dates: xx/xx/xxxx or phone +xx-xxx-xxx-xx-xx */
  mask?: string;
  /** Changes the input from single line input to multiline input */
  multiline?: true | false;
  /** Maximum number of characters allowed. Overridden by mask if present */
  maxLength?: number;
  /** Add left component to the input. Usually used for displaying icon */
  leftComponent?: ReactElement;
  /** Add right component to the input. Usually used for displaying icon */
  rightComponent?: ReactElement;
  /** Set custom animation duration. Default 200 ms */
  animationDuration?: number;
  /** Label Props */
  labelProps?: TextProps;
  /** Validation rules for the field. These rules are used by `react-hook-form` to validate the input */
  rules?: Omit<
    RegisterOptions<FieldValue<TFieldValues>, Path<FieldValue<TFieldValues>>>,
    'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  /** Array of fieldNames witch should be saved */
  fieldNamesToSave?: string[];
  /** Set/Fetch key to/from AsyncLocalStorage used with fieldNamesToSave */
  storageInputKey?: string;
  /** getValues fn `react-hook-form` used with fieldNamesToSave */
  getValues?: UseFormGetValues<FieldValue<TFieldValues>>;
  /** setValue fn `react-hook-form` used with fieldNamesToSave */
  setValue?: UseFormSetValue<FieldValue<TFieldValues>>;
  /** Max saving input values. Default is 5 */
  maxSaveValueLength?: number;
}

interface IControlledInputTextRef {
  focus(): void;
  blur(): void;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

const INPUT_FONT_SIZE = 14;
const FOCUSED_LABEL_FONT_SIZE = 10;
const LABEL_TOP_PADDING = 6;

const NUIControlledInputText = forwardRef<
  IControlledInputTextRef,
  IControlledInputTextProps<FieldValues>
>(
  (
    {
      control,
      label,
      labelProps,
      mask,
      maxLength,
      inputStyles,
      onChangeText,
      isFocused = false,
      onBlur,
      onFocus,
      leftComponent,
      rightComponent,
      hint,
      hintTextColor,
      onSubmit,
      containerStyles,
      multiline,
      value = '',
      animationDuration = 200,
      rules,
      name,
      defaultValue,
      onPress,
      storageInputKey = 'defaultForm',
      getValues,
      setValue,
      maxSaveValueLength = 5,
      fieldNamesToSave,
      ...rest
    },
    ref,
  ) => {
    const {colors, fonts} = useTheme();
    const [halfTop, setHalfTop] = useState<number>(0);
    const [isFocusedState, setIsFocusedState] = useState<boolean>(isFocused);

    const [showStoredValuesList, setShowStoredValuesList] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const {
      field,
      fieldState: {error},
      formState: {isSubmitting},
    } = useController({control, name, rules, defaultValue});

    const sharedValueOpacity = useSharedValue(value ? 1 : 0);
    const fontSizeAnimated = useSharedValue(
      isFocused ? FOCUSED_LABEL_FONT_SIZE : INPUT_FONT_SIZE,
    );
    const topAnimated = useSharedValue(0);
    const fontColorAnimated = useSharedValue(0);

    const handleFocus = useCallback(async () => {
      setIsFocusedState(true);
    }, []);

    const handleBlur = () => {
      setIsFocusedState(false);
      setShowStoredValuesList(false);
    };

    const animateFocus = useCallback(() => {
      fontSizeAnimated.value = FOCUSED_LABEL_FONT_SIZE;
      topAnimated.value = defaultValue
        ? -(LABEL_TOP_PADDING * 2)
        : -halfTop + FOCUSED_LABEL_FONT_SIZE;
      fontColorAnimated.value = 1;
    }, [
      defaultValue,
      fontColorAnimated,
      fontSizeAnimated,
      halfTop,
      topAnimated,
    ]);

    const animateBlur = useCallback(() => {
      fontSizeAnimated.value = INPUT_FONT_SIZE;
      topAnimated.value = 0;
      fontColorAnimated.value = 0;
    }, [fontColorAnimated, fontSizeAnimated, topAnimated]);

    const onSubmitEditing = useCallback(() => {
      onSubmit?.();
    }, [onSubmit]);

    const style: TextStyle = StyleSheet.flatten([
      {
        alignSelf: 'center',
        position: 'absolute',
        flex: 1,
        zIndex: 999,
      },
    ]);

    const onChangeTextCallback = useCallback(
      (val: string) => {
        const newValue = mask ? getValueWithMask({value: val, mask}) : val;

        field.onChange(newValue);

        setShowStoredValuesList(false);

        if (onChangeText) {
          onChangeText(newValue ?? '');
        }
      },
      [field, mask, onChangeText],
    );

    const onLayout = (event: LayoutChangeEvent) => {
      const {height} = event.nativeEvent.layout;
      setHalfTop(height / 2 - LABEL_TOP_PADDING);
    };

    const positionAnimations = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: withTiming(topAnimated.value, {
            duration: animationDuration,
            easing: Easing.in(Easing.ease),
          }),
        },
      ],
      opacity: withTiming(sharedValueOpacity.value, {
        duration: animationDuration,
        easing: Easing.in(Easing.ease),
      }),
      fontSize: withTiming(fontSizeAnimated.value, {
        duration: animationDuration,
        easing: Easing.in(Easing.ease),
      }),
    }));

    const progress = useDerivedValue(() =>
      withTiming(fontColorAnimated.value, {
        duration: 50,
        easing: Easing.in(Easing.ease),
      }),
    );

    const fontFamilyAnimation = useAnimatedStyle(() => ({
      fontFamily: progress.value ? fonts.regular : fonts.bold,
    }));

    const colorAnimation = useAnimatedStyle(() => ({
      color: interpolateColor(
        progress.value,
        [0, 1],
        [colors.neutral['40'], colors.neutral['50']],
      ),
    }));

    const handleSelectStoredValue = (item: FieldValues) => {
      if (setValue) {
        Object.entries(item).forEach(([key, val]) => {
          setValue(key, val);
        });
      }
      setShowStoredValuesList(false);
      inputRef.current?.blur();
    };

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }));

    useEffect(() => {
      sharedValueOpacity.value = 1;
    }, [sharedValueOpacity]);

    useEffect(() => {
      if (isFocusedState || value || field.value) {
        animateFocus();
      } else {
        animateBlur();
      }
    }, [isFocusedState, value, animateFocus, animateBlur, field.value]);

    return (
      <View style={{position: 'relative'}}>
        <Container>
          <TouchableWithoutFeedback
            onLayout={onLayout}
            onPress={e => {
              onPress?.(e);
              inputRef.current?.focus();
            }}
            style={{flex: 1}}>
            <View style={{flexDirection: 'row', flexGrow: 1}}>
              <InputContainer
                isFocused={isFocusedState}
                style={[containerStyles]}>
                {leftComponent && leftComponent}
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <AnimatedText
                    {...labelProps}
                    onPress={e => {
                      onPress?.(e);
                      inputRef.current?.focus();
                    }}
                    style={[
                      style,
                      {opacity: 0},
                      positionAnimations,
                      colorAnimation,
                      fontFamilyAnimation,
                      labelProps?.style,
                    ]}
                    suppressHighlighting>
                    {label}
                  </AnimatedText>
                  <Input
                    ref={inputRef}
                    onBlur={onBlur !== undefined ? onBlur : handleBlur}
                    onFocus={onFocus !== undefined ? onFocus : handleFocus}
                    onPress={onPress}
                    onSubmitEditing={onSubmitEditing}
                    selectionColor={colors.primary.neutral}
                    value={value !== '' ? value : field.value}
                    {...rest}
                    maxLength={mask?.length ?? maxLength}
                    multiline={multiline}
                    onChangeText={onChangeTextCallback}
                    placeholder={isFocusedState && hint ? hint : ''}
                    placeholderTextColor={hintTextColor}
                    style={StyleSheet.flatten([
                      inputStyles,
                      {top: LABEL_TOP_PADDING},
                    ])}
                  />
                </View>
                {rightComponent && rightComponent}
              </InputContainer>
            </View>
          </TouchableWithoutFeedback>
          {error?.message && <ErrorText> {error.message}</ErrorText>}
        </Container>
      </View>
    );
  },
);

NUIControlledInputText.displayName = 'NUIControlledInputText';

export {NUIControlledInputText};

const Container = styled.View`
  gap: 8px;
`;

const InputContainer = styled.View<{isFocused: boolean}>`
  flex: 1;
  flex-direction: row;
  border-radius: 16px;
  padding: 10px 12px;
  align-items: center;
  justify-content: center;
  background-color: ${({isFocused, theme}) =>
    isFocused ? theme.colors.accent['10'] : theme.colors.primary.background};
`;

const Input = styled(TextInput)`
  flex: 1;
  padding: 0;
  z-index: 10;
  min-height: ${({theme}) => theme.verticalScale(36)};
  color: ${({theme}) => theme.colors.primary.neutral};
  font-family: ${({theme}) => theme.fonts.bold};
`;

const ErrorText = styled(NUIText)`
  color: ${({theme}) => theme.colors.primary.warning};
  font-size: ${({theme}) => theme.fontSizes.xs};
`;
