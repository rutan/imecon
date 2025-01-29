import { type ConvertImageFileType, useConvertFileType } from '../hooks';
import { cx } from '../utils';

const LIST = [
  { value: 'auto', label: '画像形式：自動' },
  { value: 'image/jpeg', label: '画像形式：JPEG' },
  { value: 'image/png', label: '画像形式：PNG' },
  { value: 'image/webp', label: '画像形式：WebP' },
];

export interface ConvertImageFileTypeSelectorProps {
  className?: string;
}

export const ConvertImageFileTypeSelector = ({ className }: ConvertImageFileTypeSelectorProps) => {
  const { convertFileType, setConvertFileType } = useConvertFileType();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ConvertImageFileType;
    setConvertFileType(value);
  };

  return (
    <select
      className={cx(
        'ConvertImageFileTypeSelector',
        'cursor-pointer block w-full p-2 bg-slate-700 border border-gray-600 text-white rounded',
        className,
      )}
      value={convertFileType}
      onChange={handleChange}
    >
      {LIST.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};
