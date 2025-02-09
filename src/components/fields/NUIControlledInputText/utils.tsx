type Mask = string;

type MaskTypeArgs = {
  value: string;
  mask: Mask;
};

type ResultType = string | undefined;

export function getValueWithMask({ value, mask }: MaskTypeArgs): ResultType {
  const unmasked = value.replace(/[^0-9A-Za-z]/g, '');

  if (unmasked.length === 0) {
    return '';
  }

  let result = '';
  let unmaskedIndex = 0;

  // eslint-disable-next-line no-restricted-syntax
  for (const maskChar of mask) {
    if (unmaskedIndex >= unmasked.length) {
      break;
    }

    if (maskChar.match(/[^0-9A-Za-z]/)) {
      result += maskChar;
    } else {
      result += unmasked[unmaskedIndex];
      unmaskedIndex += 1;
    }
  }

  return result;
}
