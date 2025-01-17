import { ConvertImageFileTypeSelector, ImageList, InputImageArea, ResultBar } from './components';
import { cx } from './utils';

export const App = () => {
  return (
    <div className={cx('App', 'w-full h-full')}>
      <div className="container mx-auto py-4 pb-24">
        <h1 className="text-white text-center text-4xl my-8">画像を圧縮するやつ</h1>
        <ConvertImageFileTypeSelector className="my-4" />
        <InputImageArea className="my-4" />
        <ImageList className="my-4" />
      </div>
      <ResultBar />
    </div>
  );
};
