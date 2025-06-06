import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import type React from 'react';
import { describe, expect, it } from 'vitest';
import { InputImageArea } from '../components';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <Provider>{children}</Provider>;

describe('InputImageArea', () => {
  it('renders', () => {
    render(<InputImageArea />, { wrapper });
    expect(screen.getByTestId('input-image-area')).toBeInTheDocument();
  });
});
