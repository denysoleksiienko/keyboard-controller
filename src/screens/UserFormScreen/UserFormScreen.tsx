import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {useTheme} from '@emotion/react';
import {View} from 'react-native';
import {useBasket, useBasketDispatch} from '../../contexts/BasketContext';
import {
  PassengerFormElement,
  UserForm,
} from '../../components/passanger/UserForm/UserForm';
import {
  ContactFormElement,
  ContactsForm,
} from '../../components/ContactsForm/ContactsForm';
import {useOnSubmitPassengerForm} from '../../hooks/usePassengerForm';
import {NUISafeScreen} from '../../components/shared/NUISafeScreen/NUISafeScreen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {NUIColumn} from '../../components/elements/layouts';
import {isIos} from '../../utils/native-utils';
import {PromoForm} from '../../components/PromoForm/PromoForm';
import {BasketSummary} from '../../components/BasketSummary/BasketSummary';

export function UserFormScreen({route, navigation}) {
  const reservationBasket = useBasket();
  const {inline} = useTheme();
  const [unprocessedSeats, setUnprocessedSeats] = useState<any>([]);
  const passengerFormsRefs = useRef<PassengerFormElement[]>([]);
  const contactFormRef = useRef<ContactFormElement>(null);

  useEffect(() => {
    let unprocessed: any[] = [];
    if (reservationBasket?.reservations?.length) {
      unprocessed = reservationBasket.reservations.filter(
        item => !item.ticketId,
      );
    }
    setUnprocessedSeats(unprocessed);
  }, [reservationBasket]);

  useEffect(() => {
    passengerFormsRefs.current = passengerFormsRefs.current.slice(
      0,
      unprocessedSeats?.length ?? 0,
    );
  }, [unprocessedSeats]);

  const onSubmit = useOnSubmitPassengerForm({
    passengerForms: passengerFormsRefs.current as PassengerFormElement[],
    contactForm: contactFormRef.current!,
    handleSubmitData: () => {},
  });

  const renderPassengerForms = useCallback(
    () =>
      reservationBasket.reservations.map((item, index) => (
        <UserForm
          key={`passenger-${item.basketId}`}
          ref={el => {
            if (el) passengerFormsRefs.current[index] = el;
          }}
          passengerIndex={index}
          ticketData={item}
        />
      )),
    [reservationBasket.reservations],
  );

  return (
    <NUISafeScreen safeBottom={false} >
      <KeyboardAwareScrollView contentContainerStyle={{ paddingHorizontal: 16}} bottomOffset={20} disableScrollOnKeyboardHide>
        <NUIColumn {...(isIos && {mb: inline.gutters['2xl']})}>
          <View style={{gap: inline.gutters.lg}}>
            {renderPassengerForms()}
            {!!reservationBasket.reservations?.length && (
              <>
                <ContactsForm ref={contactFormRef} canBeInitialized />
                <PromoForm />
                <BasketSummary
                  containerStyle={{bottom: 0}}
                  enabledOverlay={false}
                  handleRemoveReservedSeat={() => {}}
                  proceed={onSubmit}
                  reservationBasket={reservationBasket}
                  style={{paddingRight: 0, paddingLeft: 0, marginTop: 100}}
                />
              </>
            )}
          </View>
        </NUIColumn>
      </KeyboardAwareScrollView>
    </NUISafeScreen>
  );
}
