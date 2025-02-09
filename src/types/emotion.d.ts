import '@emotion/react';

import { type Theme as MyTheme } from '../theme/theme';

declare module '@emotion/react' {
  export interface Theme extends MyTheme {}
}

declare module '@emotion/native' {
  export type Gutters = keyof MyTheme['gutters'];
  export type Sizes = keyof MyTheme['fontSizes'] | keyof MyTheme['lineHeight'];
}
