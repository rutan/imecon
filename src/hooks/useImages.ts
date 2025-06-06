import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';

export type ConvertImage = ConvertImageConverting | ConvertImageDone | ConvertImageError;

interface ConvertImageBase {
  id: string;
  filename: string;
  outputFilename: string;
  originalSize: number;
}

export interface ConvertImageConverting extends ConvertImageBase {
  status: 'converting';
}

export interface ConvertImageDone extends ConvertImageBase {
  status: 'done';
  result: File;
  compressedSize: number;
  convertedFileType: string;
}

export interface ConvertImageError extends ConvertImageBase {
  status: 'error';
  error: Error;
}

const imagesAtom = atom<ConvertImage[]>([]);

export const useImages = () => {
  const [images, setImages] = useAtom(imagesAtom);

  const addImage = useCallback(
    (image: ConvertImage) => {
      setImages((images) => {
        if (images.some((i) => i.id === image.id)) {
          return images.map((i) => (i.id === image.id ? image : i));
        }
        return [...images, image];
      });
    },
    [setImages],
  );

  const updateImage = useCallback(
    (id: string, image: ConvertImage) => {
      setImages((images) => {
        return images.map((i) => (i.id === id ? image : i));
      });
    },
    [setImages],
  );

  const removeImage = useCallback(
    (id: string) => {
      setImages((images) => images.filter((i) => i.id !== id));
    },
    [setImages],
  );

  const removeProcessedImages = useCallback(() => {
    setImages((images) => images.filter((i) => i.status === 'converting'));
  }, [setImages]);

  return {
    images,
    setImages,
    addImage,
    updateImage,
    removeImage,
    removeProcessedImages,
  };
};
