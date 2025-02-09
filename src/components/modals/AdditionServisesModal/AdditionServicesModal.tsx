import { useCallback, useEffect, useMemo, useRef } from 'react';

import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Control, useController } from 'react-hook-form';
import { TextStyle } from 'react-native';
import { TotalPrice } from '../../TotalPrice/TotalPrice';
import {INUIBottomSheetMethods, NUIBottomSheet} from "../../shared/NUIBottomSheet";
import {NUIButton} from "../../shared/NUIButton/NUIButton";
import {NUIText} from "../../shared/NUIText/NUIText";

interface IAdditionServicesModalProps {
  control: Control;
  id: string;
  isOpen: boolean;
  service?: any;
  cargo?: any;
  onCancel: () => void;
}

export function AdditionServicesModal({
  control,
  id,
  isOpen,
  service,
  cargo,
  onCancel,
}: IAdditionServicesModalProps) {
  const { inline, colors, fonts } = useTheme();
  const bottomSheetRef = useRef<INUIBottomSheetMethods>(null);

  const {
    field: { onChange },
  } = useController({ control, name: id });

  const handleAddService = useCallback(() => {
    onChange(true);
    bottomSheetRef.current?.close();
  }, [onChange]);

  const title = useMemo(
    () => (service ? service.name : cargo?.readable || ''),
    [cargo, service],
  );

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    }
  }, [isOpen]);

  const priceStyles: TextStyle = {
    color: colors.primary.white,
    lineHeight: inline.lineHeight.md,
    fontSize: inline.fontSizes.sm,
    fontFamily: fonts.bold,
  };

  return (
    <NUIBottomSheet
      ref={bottomSheetRef}
      onCloseRequest={onCancel}
      title={title}
    >
      {service?.price && (
        <PriceContainer>
          <TotalPrice
            amountStyle={priceStyles}
            currencyStyle={priceStyles}
            lowerCase
            price={service.price}
          />
          <CostText>cost</CostText>
        </PriceContainer>
      )}
      {service?.description && (
        <DescriptionContainer>
          {service?.description && <Text>{service.description}</Text>}
        </DescriptionContainer>
      )}
      <NUIButton onPress={handleAddService} title={'add'} />
    </NUIBottomSheet>
  );
}

const Text = styled(NUIText)`
  color: ${({ theme }) => theme.colors.primary.white};
  line-height: ${({ theme }) => theme.lineHeight.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const PriceContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const DescriptionContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CostText = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.xxs};
`;
