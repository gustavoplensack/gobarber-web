import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: #ff9000;
  border-radius: 10px;
  border: 2px solid #232129;
  padding: 16px;
  color: #312e38;
  width: 100%;
  font-weight: 500;
  margin-top: 16px;

  transition: background-color 200ms;

  &:hover {
    background: ${shade(0.2, '#ff9000')};
  }
`;