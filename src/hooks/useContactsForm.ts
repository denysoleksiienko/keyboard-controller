import {
  ForwardedRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {useForm} from 'react-hook-form';

export enum PhoneCode {
  US = '+1',
}

export type ContactForm = {
  phone: string;
  email: string;
};

export interface IContactsFormProps {
  ref: ForwardedRef<IContactFormElement>;
  canBeInitialized?: boolean;
  order: any;
  userId: string | null;
}

export interface IContactFormElement {
  submit: () => Promise<{isReady?: boolean}>;
  sendRequest: () => Promise<{data?: Set<string>}>;
}

export const useContactsForm = ({
  ref,
  order,
  userId,
  canBeInitialized,
}: IContactsFormProps) => {
  const [latestPhone, setLatestPhone] = useState<string>();
  const [latestEmail, setLatestEmail] = useState<string>();
  const [formData, setFormData] = useState<ContactForm>();
  const channelsIds = useRef<Set<string>>(new Set());

  const form = useForm<ContactForm>();

  useImperativeHandle(
    ref,
    () => ({
      submit: (): Promise<{isReady?: boolean; errors?: any}> =>
        new Promise((resolve, reject) => {
          form.handleSubmit(
            data => {
              setFormData(data as ContactForm);
              resolve({isReady: true});
            },
            responseErrors => {
              reject(responseErrors);
            },
          )();
        }),
      sendRequest: (): Promise<{data?: Set<string>}> =>
        new Promise((resolve, reject) => {
          console.log('resolve', resolve);
        }),
    }),
    [],
  );

  return {
    form,
    latestPhone,
    latestEmail,
  };
};
