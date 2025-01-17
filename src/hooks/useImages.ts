import { atom, useAtom } from 'jotai';

export type ConvertImage = ConvertImageConverting | ConvertImageDone | ConvertImageError;

interface ConvertImageBase {
  id: string;
  filename: string;
  outputFilename: string;
}

export interface ConvertImageConverting extends ConvertImageBase {
  status: 'converting';
}

export interface ConvertImageDone extends ConvertImageBase {
  status: 'done';
  result: File;
}

export interface ConvertImageError extends ConvertImageBase {
  status: 'error';
  error: Error;
}

const imagesAtom = atom<ConvertImage[]>([]);

export const useImages = () => {
  const [images, setImages] = useAtom(imagesAtom);

  const addImage = (image: ConvertImage) => {
    setImages((images) => {
      if (images.some((i) => i.id === image.id)) {
        return images.map((i) => (i.id === image.id ? image : i));
      }
      return [...images, image];
    });
  };

  const updateImage = (id: string, image: ConvertImage) => {
    setImages((images) => {
      return images.map((i) => (i.id === id ? image : i));
    });
  };

  const removeImage = (id: string) => {
    setImages((images) => images.filter((i) => i.id !== id));
  };

  return {
    images,
    setImages,
    addImage,
    updateImage,
    removeImage,
  };
};
