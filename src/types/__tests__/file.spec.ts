import { expect, test } from 'vitest';

import { removeExtension, removePrefix, toCapitalCase } from '@/types/file';

test('it remove the extension from a filename', () => {
  expect(removeExtension('song.mp3')).toBe('song');
  expect(removeExtension('song.mp3.mp3')).toBe('song.mp3');
});

test('it remove prefixes form a filename', () => {
  expect(removePrefix('01-song')).toBe('song');
  expect(removePrefix('01 - song')).toBe('song');
  expect(removePrefix('01 song')).toBe('song');
});

test('it converts a filename to capital case', () => {
  expect(toCapitalCase('a Very long song Name')).toBe('A Very Long Song Name');
});
