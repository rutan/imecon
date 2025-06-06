import { useEffect } from 'react';

export interface ImageModalProps {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
}

export const ImageModal = ({ open, src, alt, onClose }: ImageModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <button
      type="button"
      data-testid="image-modal"
      className="ImageModal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 overflow-auto"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClose();
      }}
    >
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        className="object-contain max-h-[90vh] max-w-[90vw]"
      />
    </button>
  );
};
