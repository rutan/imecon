import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import React from 'react';
import { describe, it, expect } from 'vitest';
import { ResultBar } from '../components';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider>{children}</Provider>
);

describe('ResultBar', () => {
  it('renders', () => {
    render(<ResultBar />, { wrapper });
    expect(screen.getByTestId('result-bar')).toBeInTheDocument();
  });
});
