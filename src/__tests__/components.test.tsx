import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { describe, expect, it } from 'vitest';
import { ConvertImageFileTypeSelector, ImageList, InputImageArea, ResultBar } from '../components';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <Provider>{children}</Provider>;

describe('components render', () => {
  it('InputImageArea renders', () => {
    render(<InputImageArea />, { wrapper });
    expect(screen.getByTestId('input-image-area')).toBeInTheDocument();
  });

  it('ConvertImageFileTypeSelector renders options', () => {
    render(<ConvertImageFileTypeSelector />, { wrapper });
    const select = screen.getByTestId('convert-file-type-selector');
    expect(select).toBeInTheDocument();
    expect(select.querySelectorAll('option')).toHaveLength(4);
  });

  it('ImageList renders empty list initially', () => {
    render(<ImageList />, { wrapper });
    expect(screen.getByTestId('image-list')).toBeInTheDocument();
  });

  it('ResultBar renders', () => {
    render(<ResultBar />, { wrapper });
    expect(screen.getByTestId('result-bar')).toBeInTheDocument();
  });
});
