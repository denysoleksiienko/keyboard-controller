import {useCallback, useMemo, useState} from 'react';

import styled from '@emotion/native';
import {useTheme} from '@emotion/react';
import {Pressable, View, ViewProps, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TotalPrice} from '../TotalPrice/TotalPrice';
import BasketSummaryItem from './BasketSummaryItem';
import {
  BasketActionType,
  useBasketDispatch,
} from '../../contexts/BasketContext';
import {NUIAccordionItem} from '../accordions/NUIAccordionItem';
import {useBasketSummary} from '../../hooks/useBasketSummary';
import {NUIButton} from '../shared/NUIButton/NUIButton';
import {NUITransformChevron} from '../accordions/NUITransformChevron';
import {NUIText} from '../shared/NUIText/NUIText';
import {NUITextH5} from '../elements/typography';

export interface IBasketSummaryProps {
  reservationBasket: any;
  proceed?: () => void;
  onLayout?: ViewProps['onLayout'];
  handleRemoveReservedSeat: (seat: any) => void;
  enabledOverlay?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
}

export function BasketSummary({
  reservationBasket,
  proceed,
  onLayout,
  handleRemoveReservedSeat,
  style,
  containerStyle,
  enabledOverlay = true,
}: IBasketSummaryProps) {
  const {inline} = useTheme();
  const insets = useSafeAreaInsets();
  const basketUpdate = useBasketDispatch();
  const {summary} = useBasketSummary({reservationBasket});

  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(prev => !prev);
  };

  const onProceed = useCallback(() => {
    setExpanded(false);
    if (proceed) {
      proceed();
    }
  }, [proceed]);

  const handleRemoveSeat = useCallback(
    (seatId?: string) => {
      console.log('handleRemoveSeat', seatId);
    },
    [basketUpdate],
  );

  const ticketsAmount = useMemo(
    () => reservationBasket.reservations.length,
    [reservationBasket.reservations],
  );

  if (summary == null) {
    return null;
  }

  return (
    <BasketContainer style={[style]}>
      <BasketSummaryContainer bottom={insets.bottom} style={[containerStyle]}>
        <NUIAccordionItem expanded={expanded}>
          {reservationBasket.reservations.map((reservation, index) => (
            <View
              key={reservation.basketId}
              style={{paddingHorizontal: inline.gutters['2xl']}}>
              <BasketSummaryItem
                handleRemoveReservedSeat={handleRemoveReservedSeat}
                handleRemoveSeat={handleRemoveSeat}
                reservation={reservation}
              />
              {index !== reservationBasket.reservations.length - 1 && (
                <ItemSeparator />
              )}
            </View>
          ))}
        </NUIAccordionItem>
        <SummaryView onLayout={onLayout}>
          <View style={{flex: 0.5}}>
            <NUIButton onPress={onProceed}>
              <ButtonTitle>proceed</ButtonTitle>
            </NUIButton>
          </View>
          <Pressable onPress={toggleExpand} style={{flex: 0.5}}>
            <TicketsSummaryContainer isExpanded={expanded}>
              <TotalPrice price={summary} />
              <IconWrap>
                <NUITransformChevron expanded={expanded} reversed />
              </IconWrap>
              <Text>amount: ${ticketsAmount}</Text>
            </TicketsSummaryContainer>
          </Pressable>
        </SummaryView>
      </BasketSummaryContainer>
    </BasketContainer>
  );
}

const BasketContainer = styled.View`
  flex: 1;
  padding: 0 16px;
  align-items: center;
`;

const BasketSummaryContainer = styled.View<{bottom: number}>`
  width: 100%;
  padding-top: 8px;
  border-radius: 30px;
  position: absolute;
  bottom: ${({bottom}) => (bottom ? `${bottom}px` : '20px')};
  background-color: ${({theme}) => theme.colors.primary.neutral};
  z-index: 999;
`;

const ItemSeparator = styled.View`
  flex: 1;
  border-bottom-width: 1px;
  margin: 0 -20px;
  padding-top: 8px;
  border-bottom-color: ${({theme}) => theme.colors.neutral['110']};
`;

const Text = styled(NUIText)`
  font-size: ${({theme}) => theme.fontSizes.xs};
  color: ${({theme}) => theme.colors.neutral['50']};
  line-height: ${({theme}) => theme.lineHeight.lg};
`;

const SummaryView = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
`;

const ButtonTitle = styled(NUITextH5)`
  color: ${({theme}) => theme.colors.primary.white};
`;

const TicketsSummaryContainer = styled.View<{isExpanded: boolean}>`
  border-radius: 16px;
  padding: 8px 16px;
  background-color: ${({theme, isExpanded}) =>
    isExpanded ? theme.colors.neutral['110'] : theme.colors.neutral['120']};
`;

const IconWrap = styled.View`
  position: absolute;
  right: 16px;
  bottom: 24px;
`;
