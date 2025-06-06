import { type ConvertImage, useImages } from '../hooks';
import { cx, formatFileSize } from '../utils';

export interface ImageListProps {
  className?: string;
}

export const ImageList = ({ className }: ImageListProps) => {
  const { images } = useImages();

  return (
    <div className={cx('ImageList', className)}>
      <ul data-testid="image-list">
        {images.map((image) => (
          <ImageItem key={image.id} image={image} />
        ))}
      </ul>
    </div>
  );
};

const ImageItem = ({ image }: { image: ConvertImage }) => {
  const { removeImage } = useImages();
  const handleDownload = () => {
    if (image.status !== 'done') return;

    const url = URL.createObjectURL(image.result);
    const a = document.createElement('a');
    a.href = url;
    a.download = image.outputFilename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <li className="flex justify-between items-center p-2 bg-slate-700 border border-gray-600 text-white">
      <div>
        <span
          className={cx(
            'text-white px-2 py-1 rounded mr-4 text-sm',
            image.status === 'converting' && 'bg-yellow-600',
            image.status === 'done' && 'bg-slate-500',
            image.status === 'error' && 'bg-red-600',
          )}
        >
          {image.status === 'converting' && '変換中...'}
          {image.status === 'done' && '完了'}
          {image.status === 'error' && 'エラー'}
        </span>
        <span className="w-4/6">
          {image.filename}
          <span className="block text-xs mt-1">
            {formatFileSize(image.originalSize)}
            {image.status === 'done' && ` → ${formatFileSize(image.compressedSize)}`}
          </span>
        </span>
      </div>
      <div>
        <button
          type="button"
          className="px-4 py-2 text-white underline disabled:no-underline disabled:cursor-not-allowed disabled:opacity-25"
          disabled={image.status !== 'done'}
          onClick={handleDownload}
        >
          ダウンロード
        </button>
        <button type="button" className="px-4 py-2 ml-4 text-white underline" onClick={() => removeImage(image.id)}>
          削除
        </button>
      </div>
    </li>
  );
};
