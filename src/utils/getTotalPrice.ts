type TotalPrice = {
  amount: number;
  readableCurrency: string;
  currency: string;
  full: string;
};

export const getTotalPrice = (price?: any): TotalPrice => {
  if (!price) {
    return {
      amount: 0,
      readableCurrency: '',
      currency: '',
      full: '0',
    };
  }

  return {
    amount: price.amount,
    readableCurrency: price.currency.readable,
    currency: price.currency.conventional,
    full: `${price.amount} ${price.currency.readable}`,
  };
};
