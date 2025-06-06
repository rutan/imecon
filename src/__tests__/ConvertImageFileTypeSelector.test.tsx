import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import React from 'react';
import { describe, it, expect } from 'vitest';
import { ConvertImageFileTypeSelector } from '../components';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider>{children}</Provider>
);

describe('ConvertImageFileTypeSelector', () => {
  it('renders options', () => {
    render(<ConvertImageFileTypeSelector />, { wrapper });
    const select = screen.getByTestId('convert-file-type-selector');
    expect(select).toBeInTheDocument();
    expect(select.querySelectorAll('option')).toHaveLength(4);
  });
});
