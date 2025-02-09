import { useCallback, useEffect, useRef } from 'react';

import styled from '@emotion/native';
import { View } from 'react-native';
import {INUIBottomSheetMethods, NUIBottomSheet} from "../../shared/NUIBottomSheet";
import {NUIButton} from "../../shared/NUIButton/NUIButton";
import {NUIText} from "../../shared/NUIText/NUIText";

interface ICancellationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function TicketCancellationModal({
  isOpen,
  onConfirm,
  onCancel,
}: ICancellationModalProps) {
  const bottomSheetRef = useRef<INUIBottomSheetMethods>(null);

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    }
  }, [isOpen]);

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
    bottomSheetRef.current?.close();
  }, [onConfirm]);

  return (
    <NUIBottomSheet
      ref={bottomSheetRef}
      onCloseRequest={onCancel}
      title={'title'}
    >
      <Message>{'body'}</Message>
      <ButtonsContainer>
        <View style={{ flex: 0.5 }}>
          <NUIButton onPress={handleConfirm} title={'confirm'} />
        </View>
        <View style={{ flex: 0.5 }}>
          <NUIButton
            onPress={() => bottomSheetRef.current?.close()}
            title={'cancel'}
            variant="neutral"
          />
        </View>
      </ButtonsContainer>
    </NUIBottomSheet>
  );
}

const Message = styled(NUIText)`
  color: ${({theme}) => theme.colors.primary.white};
  line-height: ${({theme}) => theme.lineHeight.md};
  font-size: ${({theme}) => theme.fontSizes.sm};
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  margin-top: 20px;
  gap: 16px;
`;
