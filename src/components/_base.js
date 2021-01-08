import styled from 'styled-components';

export const Base = styled.div`
  padding: 20px;
  background-color: white;
`;

export const Main = styled(Base)`
  flex: 1;
  box-sizing: border-box;
  background-color: white;
  vertical-align: top;
`;

export const Side = styled(Base)`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 20px 0 20px 15px;
  width: 235px;
  background-color: rgba(255, 255, 255, 0.9);
  vertical-align: top;

  @media (max-width: 775px) {
    display: none;
  }
`;
