import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'jotai';
import React, { useEffect } from 'react';
import { describe, expect, it } from 'vitest';
import { ImageList } from '../';
import { type ConvertImageDone, useImages } from '../../hooks';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => <Provider>{children}</Provider>;

describe('ImageList', () => {
  it('renders empty list initially', () => {
    render(<ImageList />, { wrapper });
    expect(screen.getByTestId('image-list')).toBeInTheDocument();
  });

  it('remove button deletes item from list', async () => {
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

  it('shows thumbnail when conversion is done', async () => {
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
      return <ImageList />;
    };

    render(<Setup />, { wrapper });
    const img = await screen.findByAltText('foo.png');
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('bg-white');
  });

  it('displays converted file type', async () => {
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
      return <ImageList />;
    };

    render(<Setup />, { wrapper });
    const label = await screen.findByTestId('converted-file-type');
    expect(label).toHaveTextContent('PNG');
  });
});
