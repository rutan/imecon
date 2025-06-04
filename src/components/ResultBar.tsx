import JSZip from 'jszip';
import { useCallback, useMemo } from 'react';
import { useImages } from '../hooks';
import { cx } from '../utils';

export interface ResultBarProps {
  className?: string;
}

export const ResultBar = ({ className }: ResultBarProps) => {
  const { images } = useImages();

  const convertedCount = useMemo(() => {
    return images.filter((image) => image.status === 'done').length;
  }, [images]);

  const imagesWithoutErrorCount = useMemo(() => {
    return images.filter((image) => image.status !== 'error').length;
  }, [images]);

  const handleDownload = useCallback(async () => {
    const zip = new JSZip();
    for (const image of images) {
      if (image.status === 'done') {
        zip.file(image.outputFilename, await image.result.arrayBuffer());
      }
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'images.zip';
    a.click();
  }, [images]);

  return (
    <div
      data-testid="result-bar"
      className={cx(
        'ResultBar',
        'fixed bottom-0 left-0 w-full p-4 bg-slate-700 border-t border-gray-600 text-white',
        className,
      )}
    >
      <div className="container mx-auto flex justify-between items-center ">
        <div>
          変換済み: {convertedCount} / {imagesWithoutErrorCount}
        </div>
        <div>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:cursor-not-allowed disabled:opacity-30 disabled:bg-gray-400"
            onClick={handleDownload}
            disabled={convertedCount === 0 || convertedCount !== imagesWithoutErrorCount}
          >
            ZIPでダウンロード
          </button>
        </div>
      </div>
    </div>
  );
};
