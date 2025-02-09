import { useMemo } from 'react';
import styled from '@emotion/native';
import { TextStyle } from 'react-native';
import {getTotalPrice} from "../../utils/getTotalPrice";
import {NUIText} from "../shared/NUIText/NUIText";
import {NUISubTextH3} from "../elements/typography";

interface ITotalPriceProps {
  price?: any;
  amountStyle?: TextStyle;
  currencyStyle?: TextStyle;
  lowerCase?: boolean;
}

export function TotalPrice({
  price,
  amountStyle,
  currencyStyle,
  lowerCase,
}: ITotalPriceProps) {
  const totalPrice = useMemo(() => {
    if (!price) return null;

    return getTotalPrice(price);
  }, [price]);

  if (!totalPrice) {
    return null;
  }

  return (
    <Container>
      <AmountText style={amountStyle}>{totalPrice.amount}</AmountText>
      <CurrencyText lowerCase={lowerCase} style={currencyStyle}>
        {totalPrice.readableCurrency}
      </CurrencyText>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: flex-end;
  gap: 6px;
`;

const CurrencyText = styled(NUIText)<{ lowerCase?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.neutral['50']};
  line-height: ${({ theme }) => theme.lineHeight.lg};
  ${({ lowerCase }) => lowerCase && 'text-transform: lowercase;'}
`;

const AmountText = styled(NUISubTextH3)<{ lowerCase?: boolean }>`
  color: ${({ theme }) => theme.colors.primary.accent};
`;
