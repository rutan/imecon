import { describe, expect, it } from 'vitest';
import { generateOutputFilename } from '../components/InputImageArea';

describe('generateOutputFilename', () => {
  it('returns same filename when type is auto', () => {
    expect(generateOutputFilename('foo.png', 'auto')).toBe('foo.png');
  });

  it('replaces extension based on type', () => {
    expect(generateOutputFilename('foo.png', 'image/jpeg')).toBe('foo.jpeg');
  });
});
