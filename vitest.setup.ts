import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom does not implement createObjectURL
// https://github.com/jsdom/jsdom/issues/1721
if (!('createObjectURL' in URL)) {
  Object.defineProperty(URL, 'createObjectURL', {
    writable: true,
    configurable: true,
    value: vi.fn(),
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    writable: true,
    configurable: true,
    value: vi.fn(),
  });
}
