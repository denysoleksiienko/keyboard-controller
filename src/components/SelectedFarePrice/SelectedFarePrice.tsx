import {useMemo} from 'react';

import {TotalPrice} from '../TotalPrice/TotalPrice';
import {Fare, FareType} from '../../types/FareType';
import {useBasket} from '../../contexts/BasketContext';

interface ISelectedFarePriceProps {
  farePrices: FareType[];
  selectedFare: Fare;
}

export function SelectedFarePrice({
  farePrices,
  selectedFare,
}: ISelectedFarePriceProps) {
  const basket = useBasket();

  const selectedFarePrice = useMemo(() => {
    const selectedItem = farePrices.find(
      farePrice => farePrice.fare.conventional === selectedFare,
    );

    if (basket?.discount && selectedItem) {
      return {
        ...selectedItem,
        price: {
          ...selectedItem?.price,
          amount: Number(
            selectedItem?.price?.amount + basket?.discount.toFixed(2),
          ),
        },
      };
    }

    return selectedItem;
  }, [basket?.discount, farePrices, selectedFare]);

  return <TotalPrice lowerCase price={selectedFarePrice?.price} />;
}
