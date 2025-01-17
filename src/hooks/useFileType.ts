import { atom, useAtom } from 'jotai';

export type ImageFileType = 'image/jpeg' | 'image/png' | 'image/webp';
export type ConvertImageFileType = 'auto' | ImageFileType;

const convertFileTypeAtom = atom<ConvertImageFileType>('auto');

export function useConvertFileType() {
  const [convertFileType, setConvertFileType] = useAtom(convertFileTypeAtom);

  return {
    convertFileType,
    setConvertFileType,
  };
}
