import { describe, it, expect } from 'vitest';
import { clampFontSize, FONT_SIZE_MIN, FONT_SIZE_MAX } from './validation.js';

describe('clampFontSize', () => {
  it('returns value within valid range', () => {
    expect(clampFontSize(48)).toBe(48);
    expect(clampFontSize(100)).toBe(100);
  });

  it('clamps values below minimum to minimum', () => {
    expect(clampFontSize(0)).toBe(FONT_SIZE_MIN);
    expect(clampFontSize(-10)).toBe(FONT_SIZE_MIN);
    expect(clampFontSize(7)).toBe(FONT_SIZE_MIN);
  });

  it('clamps values above maximum to maximum', () => {
    expect(clampFontSize(201)).toBe(FONT_SIZE_MAX);
    expect(clampFontSize(999)).toBe(FONT_SIZE_MAX);
    expect(clampFontSize(1000)).toBe(FONT_SIZE_MAX);
  });

  it('handles string inputs', () => {
    expect(clampFontSize('48')).toBe(48);
    expect(clampFontSize('999')).toBe(FONT_SIZE_MAX);
  });

  it('handles invalid inputs', () => {
    expect(clampFontSize('')).toBe(FONT_SIZE_MIN);
    expect(clampFontSize('abc')).toBe(FONT_SIZE_MIN);
    expect(clampFontSize(NaN)).toBe(FONT_SIZE_MIN);
    expect(clampFontSize(undefined)).toBe(FONT_SIZE_MIN);
  });

  it('handles edge values exactly', () => {
    expect(clampFontSize(8)).toBe(8);
    expect(clampFontSize(200)).toBe(200);
  });
});
