import {useMemo, useState} from 'react';
import IconInfo from '../../../assets/icons/IconInfo.svg';

import styled from '@emotion/native';
import {useTheme} from '@emotion/react';
import {Control, FieldValue, FieldValues} from 'react-hook-form';
import {NUISubTextH4} from '../../elements/typography';
import {getTotalPrice} from '../../../utils/getTotalPrice';
import {NUISwitch} from '../../fields/NUISwitch/NUISwitch';
import {TouchableOpacity} from 'react-native';
import {AdditionServicesModal} from '../../modals/AdditionServisesModal/AdditionServicesModal';

interface IServiceCheckboxProps<TFieldValues extends FieldValues> {
  control: Control<FieldValue<TFieldValues>>;
  item: any;
  disabled?: boolean;
  defaultValue?: boolean;
}

export function ServiceCheckbox({
  control,
  item,
  disabled,
  defaultValue,
}: IServiceCheckboxProps<FieldValues>) {
  const {colors} = useTheme();
  const [showAdditionService, setShowAdditionService] = useState(false);

  const id = `services.${item.id}`;

  const totalPrice = useMemo(() => getTotalPrice(item.price), [item.price]);

  const handleShowAdditionService = () => {
    setShowAdditionService(prev => !prev);
  };

  return (
    <>
      <Container>
        <ServiceWrapper>
          <NUISubTextH4>{item.name}</NUISubTextH4>
          <ServicePriceText>{totalPrice.full}</ServicePriceText>
          <TouchableOpacity onPress={handleShowAdditionService}>
            <IconInfo fill={colors.accent['30']} height={16} width={16} />
          </TouchableOpacity>
        </ServiceWrapper>
        <NUISwitch
          control={control}
          defaultValue={defaultValue}
          disabled={disabled}
          id={id}
        />
      </Container>
      <AdditionServicesModal
        control={control}
        id={id}
        isOpen={showAdditionService}
        onCancel={handleShowAdditionService}
        service={item}
      />
    </>
  );
}

const Container = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ServiceWrapper = styled.View`
  flex-direction: row;
  align-items: flex-end;
  gap: 8px;
`;

const ServicePriceText = styled.Text`
  line-height: ${({theme}) => theme.lineHeight.md};
  font-size: ${({theme}) => theme.fontSizes.sm};
  color: ${({theme}) => theme.colors.neutral['30']};
  text-transform: lowercase;
`;
