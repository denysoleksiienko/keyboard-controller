import {useMemo} from 'react';
import {FareType} from '../types/FareType';

type SelectedFaresProps = {
  reservationBasket: any;
};

export const useBasketSummary = ({reservationBasket}: SelectedFaresProps) => {
  const selectedFares: FareType[] = useMemo(() => {
    if (!reservationBasket?.reservations) {
      return [];
    }

    return reservationBasket.reservations.flatMap(item => {
      if (item?.carriage?.carriageSeatGroups) {
        return item.carriage.carriageSeatGroups.flatMap(subItem =>
          subItem.farePrices.filter(
            fare => fare.fare.conventional === item.selectedFareConventional,
          ),
        );
      }
      return [];
    });
  }, [reservationBasket]);

  const summary = useMemo(() => {
    if (selectedFares?.length) {
      const amount = selectedFares.reduce(
        (acc, item) => acc + item?.price?.amount,
        0,
      );

      return {
        amount: Number(amount.toFixed(2)),
        currency: selectedFares[0].price.currency,
      };
    }

    return undefined;
  }, [reservationBasket?.discount, selectedFares]);

  return {summary, selectedFares};
};
