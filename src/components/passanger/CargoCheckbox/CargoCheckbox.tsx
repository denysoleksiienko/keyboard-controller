import {useState} from 'react';

import styled from '@emotion/native';
import {useTheme} from '@emotion/react';
import {Control, FieldValue, FieldValues} from 'react-hook-form';
import {NUISubTextH4} from '../../elements/typography';
import {NUISwitch} from '../../fields/NUISwitch/NUISwitch';
import {AdditionServicesModal} from '../../modals/AdditionServisesModal/AdditionServicesModal';
import IconInfo from '../.././../assets/icons/IconInfo.svg';
import {TouchableOpacity} from 'react-native';
interface ICargoCheckboxProps<TFieldValues extends FieldValues> {
  control: Control<FieldValue<TFieldValues>>;
  item: any;
  disabled?: boolean;
  defaultValue?: boolean;
}

export function CargoCheckbox({
  control,
  item,
  disabled,
  defaultValue,
}: ICargoCheckboxProps<FieldValues>) {
  const {colors} = useTheme();
  const [showAdditionService, setShowAdditionService] = useState(false);

  const id = `cargo.${item.conventional}`;

  const handleShowAdditionService = () => {
    setShowAdditionService(prev => !prev);
  };

  return (
    <>
      <Container>
        <ServiceWrapper>
          <NUISubTextH4>{item.readable}</NUISubTextH4>
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
        cargo={item}
        control={control}
        id={id}
        isOpen={showAdditionService}
        onCancel={handleShowAdditionService}
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
