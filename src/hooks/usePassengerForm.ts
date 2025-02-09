import {
  ForwardedRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import {FieldErrors, useForm, useWatch} from 'react-hook-form';
import {BasketActionType, useBasketDispatch} from '../contexts/BasketContext';
import {IContactFormElement} from './useContactsForm';
import {Fare, FareType} from '../types/FareType';

export type PassengerForm = {
  lastName: string;
  firstName: string;
  birthDate?: string;
  fare: Fare;
};

export interface IPassengerFormElement {
  submit: () => Promise<{
    data?: PassengerForm;
    errors?: FieldErrors;
    passengerId: string;
  }>;
}

export interface IPassengerFormProps {
  ref: ForwardedRef<IPassengerFormElement>;
  ticketData: any;
}

export const fareTypeFieldName = 'fare';
export const birthDateFieldName = 'birthDate';

export const usePassengerForm = ({ref, ticketData}: IPassengerFormProps) => {
  const updateBasket = useBasketDispatch();

  const form = useForm<PassengerForm>({
    defaultValues: {birthDate: undefined},
  });

  const handleRemoveSeat = useCallback(() => {
    console.log('handleRemoveSeat');
  }, []);

  const farePrices = useMemo(
    () =>
      ticketData?.carriage?.carriageSeatGroups?.[0].farePrices as FareType[],
    [ticketData?.carriage?.carriageSeatGroups],
  );

  const defaultFareType = farePrices
    ? farePrices[0].fare.conventional
    : Fare.Full;

  const fareType = useWatch({
    control: form.control,
    name: fareTypeFieldName,
    defaultValue: defaultFareType,
  });

  const isTrainItem = (data: any): data is any => 'carriageDetails' in data;

  const highlightedServices = useMemo((): any[] | undefined => {
    if (isTrainItem(ticketData)) {
      return ticketData.carriageDetails?.availableServices?.filter(
        item => item.highlighted,
      );
    }
    return undefined;
  }, [ticketData]);

  const availableNotHighlightedServices = useMemo((): any[] | undefined => {
    if (isTrainItem(ticketData)) {
      return ticketData.carriageDetails?.availableServices?.filter(
        item => !item.highlighted,
      );
    }
    return undefined;
  }, [ticketData]);

  useEffect(() => {
    if (
      updateBasket &&
      ticketData.basketId &&
      ticketData.selectedFareConventional !== fareType
    ) {
      updateBasket({
        type: BasketActionType.UPDATE,
        basketId: ticketData.basketId,
        basketItem: {selectedFareConventional: fareType},
      });
    }
  }, [fareType, ticketData, updateBasket]);

  useEffect(() => {
    if (fareType !== Fare.Child) {
      form.resetField(birthDateFieldName);
    }
  }, [fareType, form]);

  useImperativeHandle(
    ref,
    (): IPassengerFormElement => ({
      submit: () =>
        new Promise(resolve => {
          form.handleSubmit(
            data => {
              resolve({
                data: data as PassengerForm,
                passengerId: ticketData.basketId as string,
              });
            },
            responseErrors => {
              resolve({
                errors: responseErrors,
                passengerId: ticketData.basketId as string,
              });
            },
          )();
        }),
    }),
    [form, ticketData.basketId],
  );

  return {
    form,
    handleRemoveSeat,
    farePrices,
    defaultFareType,
    fareType,
    highlightedServices,
    availableNotHighlightedServices,
  };
};

export const useOnSubmitPassengerForm = ({
  passengerForms,
  contactForm,
  handleSubmitData,
}: {
  passengerForms: IPassengerFormElement[];
  contactForm: IContactFormElement;
  handleSubmitData: (
    reservations: Record<string, PassengerForm>,
  ) => Promise<void>;
}) => {
  return useCallback(async () => {
    const passengerSubmitProcesses = Promise.all(
      passengerForms.map(passengerForm => passengerForm?.submit()),
    );
    const contactSubmitProcess = contactForm?.submit();

    Promise.all([passengerSubmitProcesses, contactSubmitProcess]).then(
      ([passengerFormsData, contactFormData]) => {
        if (
          passengerFormsData.every(res => !!res?.data) &&
          contactFormData.isReady
        ) {
          const reservations: Record<string, PassengerForm> = {};

          passengerFormsData.forEach(passenger => {
            if (passenger.data && passenger.passengerId) {
              reservations[passenger.passengerId] = passenger.data;
            }
          });

          handleSubmitData(reservations);
        }
      },
    );
  }, [contactForm, handleSubmitData, passengerForms]);
};
