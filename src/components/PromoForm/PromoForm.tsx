import {useCallback, useEffect, useState} from 'react';

import styled from '@emotion/native';
import {useForm} from 'react-hook-form';
import {useBasket, useBasketDispatch} from '../../contexts/BasketContext';
import {NUICardWithCollapsing} from '../shared/NUICardWithCollapsing/NUICardWithCollapsing';
import {NUIControlledInputText} from '../fields/NUIControlledInputText/NUIControlledInputText';
import {NUIButton} from '../shared/NUIButton/NUIButton';
import {NUIText} from '../shared/NUIText/NUIText';

export function PromoForm() {
  const [discountSearch, setDiscountSearch] = useState<string>('');
  const reservationBasket = useBasket();
  const basketOrder = useBasketDispatch();
  const {control, handleSubmit} = useForm<{promo: string}>();

  const onSubmit = useCallback(
    (dataFrom: {promo: string}) => {
      if (dataFrom?.promo.trim()) {
        setDiscountSearch(dataFrom.promo);
      }
    },
    [basketOrder],
  );

  if (!reservationBasket) {
    return null;
  }

  return (
    <NUICardWithCollapsing enabledCollapsing={false} headerTitle={'promo'}>
      <FormContainer>
        <Title>promoInfo</Title>
        <NUIControlledInputText
          control={control}
          defaultValue={reservationBasket?.discount?.code}
          id="promo"
          label={'Promo'}
          name="promo"
        />
        <NUIButton onPress={handleSubmit(onSubmit)} title={'confirm'} />
      </FormContainer>
    </NUICardWithCollapsing>
  );
}

const FormContainer = styled.View`
  margin-top: 6px;
  gap: 12px;
`;

const Title = styled(NUIText)`
  font-size: ${({theme}) => theme.fontSizes.xs};
  color: ${({theme}) => theme.colors.neutral['50']};
  margin-bottom: 8px;
`;
