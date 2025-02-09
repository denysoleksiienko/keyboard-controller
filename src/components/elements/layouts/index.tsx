import styled from '@emotion/native';

interface INUILayoutComponent {
  centered?: boolean;
  fill?: boolean;
  mb?: number;
  mt?: number;
  mh?: number;
  mv?: number;
}

export const NUILayoutComponent = styled.View<INUILayoutComponent>`
  ${({ fill }) => fill && 'flex: 1'};
  ${({ centered }) =>
    centered &&
    `
    align-items: center;
    justify-content: center;
  `};
  margin-bottom: ${({ mb }) => (mb ? `${mb}px` : undefined)};
  margin-top: ${({ mt }) => (mt ? `${mt}px` : undefined)};
  ${({ mh }) =>
    mh &&
    `
      margin-right: ${mh}px;
      margin-left: ${mh}px;
    `};
  ${({ mv }) =>
    mv &&
    `
      margin-top: ${mv}px;
      margin-bottom: ${mv}px;
    `};
`;

export const NUIRow = styled(NUILayoutComponent)`
  padding-left: 16px;
  padding-right: 16px;
`;

export const NUIColumn = styled(NUILayoutComponent)`
  padding-top: 16px;
  padding-bottom: 16px;
`;

export const NUIContent = styled(NUILayoutComponent)`
  padding: 16px;
`;
