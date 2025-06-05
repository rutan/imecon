import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'jotai';
import React, { useEffect } from 'react';
import { describe, expect, it } from 'vitest';
import { ConvertImageFileTypeSelector, ImageList, InputImageArea, ResultBar } from '../components';
import { type ConvertImageDone, useImages } from '../hooks';

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

  it('remove button deletes item from list', async () => {
    const image: ConvertImageDone = {
      id: '1',
      status: 'done',
      filename: 'foo.png',
      outputFilename: 'foo.png',
      result: new File(['data'], 'foo.png', { type: 'image/png' }),
    };

    const Setup: React.FC = () => {
      const { addImage } = useImages();
      const called = React.useRef(false);
      if (!called.current) {
        addImage(image);
        called.current = true;
      }
      return <ImageList />;
    };

    render(<Setup />, { wrapper });

    expect(await screen.findByText('foo.png')).toBeInTheDocument();
    const removeButton = screen.getByRole('button', { name: '削除' });
    fireEvent.click(removeButton);
    await waitFor(() => {
      expect(screen.queryByText('foo.png')).not.toBeInTheDocument();
    });
  });
});
