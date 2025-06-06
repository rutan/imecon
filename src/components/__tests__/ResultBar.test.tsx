import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'jotai';
import type React from 'react';
import { useEffect } from 'react';
import { describe, expect, it } from 'vitest';
import { ResultBar } from '../';
import { type ConvertImageDone, useImages } from '../../hooks';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <Provider>{children}</Provider>;

describe('ResultBar', () => {
  it('renders', () => {
    render(<ResultBar />, { wrapper });
    expect(screen.getByTestId('result-bar')).toBeInTheDocument();
  });

  it('clear button removes all converted images', async () => {
    const image: ConvertImageDone = {
      id: '1',
      status: 'done',
      filename: 'foo.png',
      outputFilename: 'foo.png',
      originalSize: 8,
      compressedSize: 4,
      result: new File(['data'], 'foo.png', { type: 'image/png' }),
      convertedFileType: 'image/png',
    };

    const Setup: React.FC = () => {
      const { addImage } = useImages();
      useEffect(() => {
        addImage(image);
      }, [addImage]);
      return <ResultBar />;
    };

    render(<Setup />, { wrapper });

    expect(await screen.findByText('変換済み: 1 / 1')).toBeInTheDocument();

    const clearButton = screen.getByRole('button', { name: 'すべて削除' });
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText('変換済み: 0 / 0')).toBeInTheDocument();
    });
  });
});
