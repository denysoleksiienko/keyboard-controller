import {
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import styled from '@emotion/native';
import {useTheme} from '@emotion/react';
import {format} from 'date-fns';
import {TextInput, View} from 'react-native';
import {CargoCheckbox} from '../CargoCheckbox/CargoCheckbox';
import {ServiceCheckbox} from '../ServiceCheckbox/ServiceCheckbox';
import {
  fareTypeFieldName,
  IPassengerFormElement,
  IPassengerFormProps,
  usePassengerForm,
} from '../../../hooks/usePassengerForm';
import {
  INUIDatePickerBottomSheetHandle,
  NUIDatePickerBottomSheet,
} from '../../shared/NUIDatePickerBottomSheet/NUIDatePickerBottomSheet';
import {NUICardWithCollapsing} from '../../shared/NUICardWithCollapsing/NUICardWithCollapsing';
import {SelectedFarePrice} from '../../SelectedFarePrice/SelectedFarePrice';
import {NUIToggleButtonGroup} from '../../fields/NUIToggleButtonGroup/NUIToggleButtonGroup';
import {NUIToggleButton} from '../../fields/NUIToggleButton/NUIToggleButton';
import {NUIControlledInputText} from '../../fields/NUIControlledInputText/NUIControlledInputText';
import {Fare} from '../../../types/FareType';
import {NUIDivider} from '../../shared/NUIDivider/NUIDivider';

export type PassengerFormProps = Omit<IPassengerFormProps, 'ticketData'> & {
  passengerIndex: number;
  ticketData: any;
};

export type PassengerFormElement = IPassengerFormElement;

export const UserForm = forwardRef<PassengerFormElement, PassengerFormProps>(
  (
    {passengerIndex, ticketData}: PassengerFormProps,
    ref: ForwardedRef<PassengerFormElement>,
  ) => {
    const {colors} = useTheme();

    const firstNameRef = useRef<TextInput>(null);
    const lastNameRef = useRef<TextInput>(null);
    const datePickerRef = useRef<INUIDatePickerBottomSheetHandle>(null);

    const {
      form: {
        control,
        setValue,
        getValues,
        clearErrors,
        formState: {errors},
      },
      handleRemoveSeat,
      fareType,
      defaultFareType,
      farePrices,
      highlightedServices,
      availableNotHighlightedServices,
    } = usePassengerForm({ref, ticketData});

    const includedServices = useMemo(
      () => ticketData.carriageDetails?.includedServices,
      [ticketData.carriageDetails?.includedServices],
    );

    const availableCargoItems = useMemo(
      () => ticketData.carriageDetails?.availableCargoItems,
      [ticketData.carriageDetails?.availableCargoItems],
    );

    const renderHighlightedServices = useCallback(
      () => (
        <ServicesContainer>
          {includedServices?.map(item => (
            <View key={`services-${item.id}`}>
              <ServiceCheckbox
                control={control}
                defaultValue
                disabled
                item={item}
              />
            </View>
          ))}
          {highlightedServices?.map(item => (
            <ServiceCheckbox
              key={`services-${item.id}`}
              control={control}
              item={item}
            />
          ))}
        </ServicesContainer>
      ),
      [control, highlightedServices, includedServices],
    );

    const renderAvailableNotHighlightedServices = useCallback(
      () =>
        (!!availableNotHighlightedServices?.length ||
          !!availableCargoItems?.length) && (
          <ServicesContainer>
            {(!!includedServices?.length || !!highlightedServices?.length) && (
              <ItemSeparator />
            )}

            {availableNotHighlightedServices?.map(item => (
              <View key={`services-${item.id}`}>
                <ServiceCheckbox control={control} item={item} />
                <ItemSeparator />
              </View>
            ))}
            {availableCargoItems?.map(item => (
              <View key={`cargo-${item.conventional}`}>
                <CargoCheckbox control={control} item={item} />
                <ItemSeparator />
              </View>
            ))}
          </ServicesContainer>
        ),
      [
        availableCargoItems,
        availableNotHighlightedServices,
        control,
        highlightedServices?.length,
        includedServices?.length,
      ],
    );

    const handleOpenPicker = () => {
      datePickerRef.current?.open();
    };

    const handleDateConfirm = useCallback(
      (date: Date) => {
        clearErrors('birthDate');
        setValue('birthDate', format(date, 'd-MM-yyyy'));
      },
      [clearErrors, setValue],
    );

    useEffect(() => {
      const errorFieldName = Object.keys(errors).find(field => errors[field]);

      if (errorFieldName) {
        const fieldRefs: Record<string, RefObject<TextInput>> = {
          lastName: lastNameRef,
          firstName: firstNameRef,
        };
        fieldRefs[errorFieldName]?.current?.focus();
      }
    }, [errors]);

    return (
      <>
        <NUICardWithCollapsing
          collapsibleContent={() => renderAvailableNotHighlightedServices()}
          footerTitle={() => renderHighlightedServices()}
          headerRightIconPress={handleRemoveSeat}
          headerTitle={() => (
            <>
              {'User'} {passengerIndex + 1}
            </>
          )}>
          <TicketInfoContainer>
            <SelectedFarePrice
              farePrices={farePrices}
              selectedFare={fareType}
            />
          </TicketInfoContainer>
          <FormContainer>
            <NUIToggleButtonGroup
              control={control}
              defaultValue={defaultFareType}
              id={fareTypeFieldName}>
              {farePrices?.map(item => (
                <NUIToggleButton
                  key={`fareType.${item.fare.conventional}`}
                  value={item.fare.conventional}>
                  {item.fare.readable}
                </NUIToggleButton>
              ))}
            </NUIToggleButtonGroup>
            <NUIControlledInputText
              ref={lastNameRef}
              control={control}
              fieldNamesToSave={['lastName', 'firstName']}
              getValues={getValues}
              id={`${ticketData.basketId}.lastName`}
              label={'lastName'}
              name="lastName"
              onSubmitEditing={() => firstNameRef?.current?.focus()}
              returnKeyType="next"
              setValue={setValue}
              storageInputKey="passenger"
            />
            <NUIControlledInputText
              ref={firstNameRef}
              control={control}
              fieldNamesToSave={['lastName', 'firstName']}
              getValues={getValues}
              id={`${ticketData.basketId}.firstName`}
              label={'firstName'}
              name="firstName"
              setValue={setValue}
              storageInputKey="passenger"
            />
            {fareType === Fare.Child && (
              <NUIControlledInputText
                control={control}
                defaultValue={format(new Date(), 'd-MM-yyyy')}
                editable={false}
                id={`${ticketData.basketId}.birthDate`}
                label={'birthDate'}
                name="birthDate"
                onPress={handleOpenPicker}
                pointerEvents="none"
              />
            )}
          </FormContainer>
        </NUICardWithCollapsing>
        <NUIDatePickerBottomSheet
          ref={datePickerRef}
          onConfirm={handleDateConfirm}
          title={'birthDateLabel'}
        />
      </>
    );
  },
);

UserForm.displayName = 'UserForm';

const TicketInfoContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const FormContainer = styled.View`
  margin-top: 12px;
  gap: 12px;
`;

const ServicesContainer = styled.View`
  padding: 0 20px;
`;

const ItemSeparator = () => {
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
