import {ReactElement, ReactNode, useCallback, useState} from 'react';
import styled from '@emotion/native';
import {useTheme} from '@emotion/react';
import {TouchableOpacity, View} from 'react-native';
import {hapticFeedbackTrigger} from '../../../utils/hapticFeedbackTrigger';
import {NUIDivider} from '../NUIDivider/NUIDivider';
import {NUIText} from '../NUIText/NUIText';
import {NUIAccordionItem} from '../../accordions/NUIAccordionItem';
import {NUICard} from '../../elements/card';
import {NUISubTextH3, NUISubTextH4} from '../../elements/typography';
import {NUITransformChevron} from '../../accordions/NUITransformChevron';

export interface INUICardWithCollapsingProps {
  children: ReactNode;
  headerTitle: string | (() => ReactNode);
  footerTitle?: string | (() => ReactNode);
  enabledCollapsing?: boolean;
  headerRightIconPress?: () => void;
  headerRightIcon?: ReactElement;
  collapsibleContent?: () => ReactNode | ReactElement;
}

const Divider = () => {
  const {inline} = useTheme();
  return (
    <NUIDivider
      style={{
        marginHorizontal: -inline.gutters['2xl'],
        marginVertical: inline.gutters.md,
      }}
    />
  );
};

export function NUICardWithCollapsing({
  children,
  headerTitle,
  footerTitle,
  headerRightIconPress,
  headerRightIcon,
  collapsibleContent,
  enabledCollapsing = true,
}: INUICardWithCollapsingProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(prevState => !prevState);
  };

  const onPress = useCallback(() => {
    if (headerRightIconPress) {
      headerRightIconPress();
      hapticFeedbackTrigger();
    }
  }, [headerRightIconPress]);

  return (
    <NUICard>
      <HeaderWrapper>
        <NUISubTextH3>
          {typeof headerTitle === 'function' ? headerTitle() : headerTitle}
        </NUISubTextH3>
      </HeaderWrapper>
      <Divider />

      <View style={{}}>{children}</View>

      {(enabledCollapsing || footerTitle) && (
        <>
          <Divider />
          <FooterWrapper>
            <FooterView>
              <NUISubTextH4>
                {typeof footerTitle === 'function'
                  ? footerTitle()
                  : footerTitle}
              </NUISubTextH4>
            </FooterView>
            {enabledCollapsing && collapsibleContent && (
              <>
                <NUIAccordionItem expanded={isExpanded}>
                  <View>{collapsibleContent()}</View>
                </NUIAccordionItem>

                <Touchable onPress={toggleExpand}>
                  <ButtonShowHideLabel isExpanded={isExpanded}>
                    {isExpanded ? 'hide' : 'more'}
                  </ButtonShowHideLabel>
                  <NUITransformChevron expanded={isExpanded} />
                </Touchable>
              </>
            )}
          </FooterWrapper>
        </>
      )}
    </NUICard>
  );
}

const HeaderWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const FooterWrapper = styled.View`
  justify-content: space-between;
  margin: 0 -20px;
`;

const FooterView = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const Touchable = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const ButtonShowHideLabel = styled(NUIText)<{isExpanded: boolean}>`
  font-family: ${({theme}) => theme.fonts.bold};
  font-size: ${({theme}) => theme.fontSizes.sm};
  color: ${({theme, isExpanded}) =>
    isExpanded ? theme.colors.neutral['20'] : theme.colors.primary.accent};
`;
