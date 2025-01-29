import imageCompression from 'browser-image-compression';
import { useCallback, useRef } from 'react';
import { type ConvertImage, type ConvertImageFileType, useConvertFileType, useImages } from '../hooks';
import { cx } from '../utils';

type InputFileInfo = {
  file: File;
  path: string;
};

export interface InputImageAreaProps {
  className?: string;
}

export const InputImageArea = ({ className }: InputImageAreaProps) => {
  const { addImage, updateImage } = useImages();
  const { convertFileType } = useConvertFileType();

  const handleInputFiles = useCallback(
    async (files: InputFileInfo[]) => {
      const workingPromises: Promise<void>[] = [];

      const tasks = Array.from(files)
        .sort((a, b) => a.path.localeCompare(b.path))
        .map((fileInfo) => {
          const convertImage: ConvertImage = {
            id: generateId(),
            status: 'converting',
            filename: fileInfo.path,
            outputFilename: generateOutputFilename(fileInfo.path, convertFileType),
          };
          addImage(convertImage);

          return {
            convertImage,
            fileInfo,
          };
        });

      for (let i = 0; i < tasks.length; i++) {
        // 同時に5つまでの画像を圧縮する
        if (workingPromises.length >= 5) {
          await Promise.all(workingPromises);
          workingPromises.length = 0;
        }

        const { convertImage, fileInfo } = tasks[i];
        const promise = compressImage(fileInfo.file, {
          fileType: convertFileType === 'auto' ? undefined : convertFileType,
        })
          .then((file: File) => {
            updateImage(convertImage.id, {
              ...convertImage,
              status: 'done',
              result: file,
            });
          })
          .catch((error) => {
            console.error(error);
            updateImage(convertImage.id, {
              ...convertImage,
              status: 'error',
              error,
            });
          });
        workingPromises.push(promise);
      }

      await Promise.all(workingPromises);

      if (inputFileEl.current) inputFileEl.current.value = '';
    },
    [addImage, updateImage, convertFileType],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragEl.current) {
      dragEl.current.classList.add('bg-slate-500');
      dragEl.current.classList.remove('bg-slate-900');
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dragEl.current) {
      dragEl.current.classList.remove('bg-slate-500');
      dragEl.current.classList.add('bg-slate-900');
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();

      if (dragEl.current) {
        dragEl.current.classList.remove('bg-slate-500');
        dragEl.current.classList.add('bg-slate-900');
      }
      if (e.dataTransfer.files.length === 0) return;

      const files: InputFileInfo[] = [];
      const entries = Array.from(e.dataTransfer.items).map((item) => item.webkitGetAsEntry());
      for (const entry of entries) {
        if (!entry) continue;
        files.push(...(await traverseEntry(entry, '')));
      }

      if (files.length === 0) return;
      handleInputFiles(files);
    },
    [handleInputFiles],
  );

  const dragEl = useRef<HTMLDivElement>(null);
  const inputFileEl = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: This is a drag and drop area */}
      <div
        className={cx(
          'InputImageArea',
          'w-full h-64 flex justify-center items-center cursor-pointer bg-slate-900 border-4 border-dotted border-slate-600 text-white rounded-2xl',
          className,
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputFileEl.current?.click()}
        ref={dragEl}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={() => inputFileEl.current?.files && handleInputFiles(inputFileEl.current.files)}
          className="hidden"
          ref={inputFileEl}
        />
        ここに画像をドラッグ＆ドロップ
      </div>
    </>
  );
};

async function traverseEntry(entry: FileSystemEntry, path: string): Promise<InputFileInfo[]> {
  return new Promise((resolve, reject) => {
    if (entry.isDirectory) {
      const dirReader = (entry as FileSystemDirectoryEntry).createReader();
      dirReader.readEntries(async (entries) => {
        const files: InputFileInfo[] = [];
        for (const childEntry of entries) {
          files.push(...(await traverseEntry(childEntry, `${path}${entry.name}/`)));
        }
        resolve(files);
      }, reject);
    } else if (entry.isFile) {
      const file = entry as FileSystemFileEntry;
      file.file((file) => {
        resolve([{ file, path: `${path}${file.name}` }]);
      });
    } else {
      resolve([]);
    }
  });
}

function generateId() {
  return `${Date.now()}.${Math.floor(Math.random() * 1000)}`;
}

function generateOutputFilename(filename: string, fileType: ConvertImageFileType) {
  if (fileType === 'auto') return filename;

  const ext = fileType.split('/').pop();
  return `${filename.replace(/\.\w+$/, '')}.${ext}`;
}

function detectFileType(file: File) {
  const { type, name } = file;
  if (type) return type;
  const ext = name.split('.').pop();
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'jpeg':
    case 'jpg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    default:
      return 'image/webp';
  }
}

function compressImage(
  file: File,
  options: {
    fileType?: string;
    initialQuality?: number;
  } = {},
) {
  const { fileType = detectFileType(file), initialQuality = 0.5 } = options;

  return imageCompression(file, {
    useWebWorker: true,
    fileType,
    initialQuality,
  });
}
