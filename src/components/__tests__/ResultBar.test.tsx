import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import type React from 'react';
import { describe, expect, it } from 'vitest';
import { ResultBar } from '../';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <Provider>{children}</Provider>;

describe('ResultBar', () => {
  it('renders', () => {
    render(<ResultBar />, { wrapper });
    expect(screen.getByTestId('result-bar')).toBeInTheDocument();
  });
});
