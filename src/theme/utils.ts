type PixelMap<T extends Record<string, number>> = {
  [K in keyof T]: `${T[K]}px`;
};

export const mapToPixels = <T extends Record<string, number>>(
  obj: T,
): PixelMap<T> =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, `${value}px`]),
  ) as PixelMap<T>;
