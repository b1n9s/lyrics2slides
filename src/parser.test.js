import { describe, it, expect } from 'vitest';
import { parseLyrics } from './parser.js';

describe('parseLyrics', () => {
  it('returns empty array for empty inputs', () => {
    expect(parseLyrics('', '')).toEqual([]);
  });

  it('returns empty array for whitespace-only inputs', () => {
    expect(parseLyrics('   ', '\n\n\t')).toEqual([]);
  });

  it('creates single slide from single section', () => {
    const result = parseLyrics('Line 1\nLine 2', '');
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 1,
      primary: ['Line 1', 'Line 2'],
      secondary: []
    });
  });

  it('splits on blank lines to create multiple slides', () => {
    const result = parseLyrics('Section 1\n\nSection 2', '');
    expect(result).toHaveLength(2);
    expect(result[0].primary).toEqual(['Section 1']);
    expect(result[1].primary).toEqual(['Section 2']);
  });

  it('pairs primary and secondary sections by index', () => {
    const result = parseLyrics('A\n\nB', 'X\n\nY');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: 1, primary: ['A'], secondary: ['X'] });
    expect(result[1]).toEqual({ id: 2, primary: ['B'], secondary: ['Y'] });
  });

  it('handles mismatched section counts (more primary)', () => {
    const result = parseLyrics('A\n\nB\n\nC', 'X');
    expect(result).toHaveLength(3);
    expect(result[0].secondary).toEqual(['X']);
    expect(result[1].secondary).toEqual([]);
    expect(result[2].secondary).toEqual([]);
  });

  it('handles mismatched section counts (more secondary)', () => {
    const result = parseLyrics('A', 'X\n\nY\n\nZ');
    expect(result).toHaveLength(3);
    expect(result[0].primary).toEqual(['A']);
    expect(result[1].primary).toEqual([]);
    expect(result[2].primary).toEqual([]);
  });

  it('trims whitespace from lines', () => {
    const result = parseLyrics('  Line 1  \n  Line 2  ', '');
    expect(result[0].primary).toEqual(['Line 1', 'Line 2']);
  });

  it('filters empty lines within sections', () => {
    const result = parseLyrics('Line 1\n\n\n\nLine 2', '');
    // Multiple blank lines should create 2 sections
    expect(result).toHaveLength(2);
  });

  it('handles unicode characters (CJK)', () => {
    const result = parseLyrics('你好世界', 'Hello World');
    expect(result[0].primary).toEqual(['你好世界']);
    expect(result[0].secondary).toEqual(['Hello World']);
  });

  it('handles emoji', () => {
    const result = parseLyrics('Hello 🎵 World', '');
    expect(result[0].primary).toEqual(['Hello 🎵 World']);
  });
});
