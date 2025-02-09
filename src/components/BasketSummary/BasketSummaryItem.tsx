import {useCallback} from 'react';

import IconCross from '../../assets/icons/IconCross.svg';

import styled from '@emotion/native';
import {useTheme} from '@emotion/react';
import {TotalPrice} from '../TotalPrice/TotalPrice';
import {hapticFeedbackTrigger} from '../../utils/hapticFeedbackTrigger';
import {NUISubTextH3} from "../elements/typography";
import {NUIText} from "../shared/NUIText/NUIText";
import {TouchableOpacity} from "react-native";

interface IBasketSummaryItemProps {
  reservation: any;
  handleRemoveSeat: (seatId?: string) => void;
  handleRemoveReservedSeat: (seat: any) => void;
}

export default function BasketSummaryItem({
  reservation,
  handleRemoveSeat,
  handleRemoveReservedSeat,
}: IBasketSummaryItemProps) {
  const {colors} = useTheme();

  const handleRemoveReservation = useCallback(
    (seat: any) => {
      if (reservation?.ticketId) {
        handleRemoveReservedSeat(seat);
        return;
      }
      handleRemoveSeat(seat.id);
      hapticFeedbackTrigger();
    },
    [handleRemoveReservedSeat, handleRemoveSeat, reservation?.ticketId],
  );

  return (
    <ItemsView>
      <ItemView style={{justifyContent: 'flex-start'}}>
        <Text>Lorem:</Text>
        <SeatText>{reservation.selectedSeat?.number}</SeatText>
      </ItemView>
      <ItemView>
        <Text>Lorem:</Text>
        <SeatText>{reservation.selectedSeat?.number}</SeatText>
      </ItemView>
      <ItemView>
        <TotalPrice
          price={
            reservation?.carriage?.carriageSeatGroups?.[0]?.farePrices?.[0]
              ?.price
          }
        />
        <PressableRemoveSeat
          onPress={() => handleRemoveReservation(reservation?.selectedSeat)}>
          <IconCross fill={colors.neutral['80']} height={14} width={14} />
        </PressableRemoveSeat>
      </ItemView>
    </ItemsView>
  );
}

const ItemsView = styled.View`
  flex: 1;
  flex-direction: row;
  padding-top: 8px;
  justify-content: space-between;
`;

const ItemView = styled.View`
  flex-direction: row;
  align-items: flex-end;
  gap: 6px;
  flex: 1;
`;

const Text = styled(NUIText)`
  font-size: ${({theme}) => theme.fontSizes.xs};
  color: ${({theme}) => theme.colors.neutral['50']};
  line-height: ${({theme}) => theme.lineHeight.lg};
`;

const SeatText = styled(NUISubTextH3)`
  color: ${({theme}) => theme.colors.primary.white};
`;

const PressableRemoveSeat = styled(TouchableOpacity)`
  flex: 1;
  justify-content: center;
  padding-left: 8px;
`;

const IconContainer = styled.View`
  height: 100%;
  justify-content: center;
  align-items: center;
`;
