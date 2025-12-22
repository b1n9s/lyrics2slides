export const FONT_SIZE_MIN = 8;
export const FONT_SIZE_MAX = 200;
export const FONT_SIZE_DEFAULT = 48;

/**
 * Clamp font size to valid range.
 * @param {number|string} value - Raw input value
 * @returns {number} Valid font size
 */
export function clampFontSize(value) {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < FONT_SIZE_MIN) {
    return FONT_SIZE_MIN;
  }
  if (parsed > FONT_SIZE_MAX) {
    return FONT_SIZE_MAX;
  }
  return parsed;
}
