import {ForwardedRef, forwardRef} from 'react';

import styled from '@emotion/native';
import {
  IContactFormElement,
  PhoneCode,
  useContactsForm,
} from '../../hooks/useContactsForm';
import {NUICardWithCollapsing} from '../shared/NUICardWithCollapsing/NUICardWithCollapsing';
import {NUIControlledInputText} from '../fields/NUIControlledInputText/NUIControlledInputText';

export interface IContactsFormProps {
  isEmailRequired?: boolean;
  isPhoneRequired?: boolean;
  canBeInitialized?: boolean;
  order?: any;
}

export type ContactFormElement = IContactFormElement;

export const ContactsForm = forwardRef<ContactFormElement, IContactsFormProps>(
  (
    {
      canBeInitialized,
      isEmailRequired = false,
      isPhoneRequired = false,
      order,
    }: IContactsFormProps,
    ref: ForwardedRef<ContactFormElement>,
  ) => {
    const {
      form: {control},
      latestPhone,
      latestEmail,
    } = useContactsForm({
      ref,
      canBeInitialized,
      userId: '',
      order: {},
    });

    return (
      <NUICardWithCollapsing enabledCollapsing={false} headerTitle={'contacts'}>
        <FormContainer>
          <NUIControlledInputText
            control={control}
            defaultValue={latestPhone || PhoneCode.US}
            hint="38 (xxx) xxx-xx-xx"
            id="phone"
            keyboardType="phone-pad"
            label={'PhoneNumber'}
            mask={`${PhoneCode.US} (xxx) xxx-xx-xx`}
            name="phone"
          />
          <NUIControlledInputText
            autoCapitalize="none"
            control={control}
            defaultValue={latestEmail || ''}
            id="email"
            keyboardType="email-address"
            label="E-mail"
            name="email"
          />
        </FormContainer>
      </NUICardWithCollapsing>
    );
  },
);

ContactsForm.displayName = 'ContactsForm';

const FormContainer = styled.View`
  margin-top: 12px;
  gap: 12px;
`;
