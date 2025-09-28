import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
`;

const LoadingSpinner = ({ text = 'Loading...', size = 'medium' }) => {
  const spinnerSize = size === 'small' ? '1.5rem' : size === 'large' ? '4rem' : '3rem';
  const containerHeight = size === 'small' ? '100px' : size === 'large' ? '300px' : '200px';

  return (
    <SpinnerContainer style={{ minHeight: containerHeight }}>
      <Spinner style={{ width: spinnerSize, height: spinnerSize }} />
      {text && <LoadingText>{text}</LoadingText>}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
