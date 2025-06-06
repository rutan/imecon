import { describe, expect, it } from 'vitest';
import { generateOutputFilename } from '../components/InputImageArea';
import { formatFileSize } from '../utils';

describe('generateOutputFilename', () => {
  it('returns same filename when type is auto', () => {
    expect(generateOutputFilename('foo.png', 'auto')).toBe('foo.png');
  });

  it('replaces extension based on type', () => {
    expect(generateOutputFilename('foo.png', 'image/jpeg')).toBe('foo.jpeg');
  });
});

describe('formatFileSize', () => {
  it('formats bytes to KB and MB', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(2048)).toBe('2.0 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });
});
