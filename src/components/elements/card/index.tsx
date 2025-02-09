import styled from '@emotion/native';

interface ICardProps {
  row?: boolean;
  mb?: number;
  mt?: number;
}

export const NUICard = styled.View<ICardProps>`
  padding: 16px 20px;
  border-radius: 30px;
  border-color: ${({ theme }) => theme.colors.primary.border};
  background-color: ${({ theme }) => theme.colors.primary.white};
  margin-bottom: ${({ mb }) => (mb ? `${mb}px` : undefined)};
  margin-top: ${({ mt }) => (mt ? `${mt}px` : undefined)};
  ${({ row }) => row && 'flex-direction: row;'};
`;
