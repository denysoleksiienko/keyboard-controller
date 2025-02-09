import {useCallback, useState, forwardRef, useImperativeHandle} from 'react';
import {useTheme} from '@emotion/react';
import DatePicker, {DatePickerProps} from 'react-native-date-picker';

export interface INUIDatePickerBottomSheetHandle {
  open: () => void;
  close: () => void;
}

export const NUIDatePickerBottomSheet = forwardRef<
  INUIDatePickerBottomSheetHandle,
  Omit<DatePickerProps, 'date'> & {date?: Date}
>(({date, onConfirm, ...props}, ref) => {
  const {colors} = useTheme();
  const [selectedDate, setSelectedDate] = useState(date || new Date());
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = useCallback(
    (dateValue: Date) => {
      if (onConfirm) {
        onConfirm(dateValue);
      }
      setSelectedDate(dateValue);
      setIsOpen(false);
    },
    [onConfirm],
  );

  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  return (
    <DatePicker
      cancelText={'cancel'}
      confirmText={'confirm'}
      dividerColor={colors.primary.accent}
      modal
      mode="date"
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      open={isOpen}
      {...props}
      date={selectedDate}
    />
  );
});

NUIDatePickerBottomSheet.displayName = 'NUIDatePickerBottomSheet';
