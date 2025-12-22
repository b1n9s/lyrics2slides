/**
 * Check if a font is available in the browser.
 * Uses the Font Loading API with fallback to canvas measurement.
 *
 * @param {string} fontFamily - Font name to check
 * @returns {Promise<boolean>} True if font is available
 */
export async function isFontAvailable(fontFamily) {
  // Use Font Loading API if available
  if (document.fonts && document.fonts.check) {
    try {
      // Load the font first
      await document.fonts.load(`16px "${fontFamily}"`);
      return document.fonts.check(`16px "${fontFamily}"`);
    } catch {
      // Fall through to canvas method
    }
  }

  // Fallback: canvas measurement method
  return isFontAvailableCanvas(fontFamily);
}

/**
 * Canvas-based font detection fallback.
 * Compares rendered width of test string in target font vs monospace.
 */
function isFontAvailableCanvas(fontFamily) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Handle environments without canvas support (e.g., jsdom in tests)
  if (!context) {
    return true; // Assume font is available in test environments
  }

  const testString = 'mmmmmmmmmmlli';
  const baseFont = 'monospace';

  context.font = `72px ${baseFont}`;
  const baseWidth = context.measureText(testString).width;

  context.font = `72px "${fontFamily}", ${baseFont}`;
  const testWidth = context.measureText(testString).width;

  return baseWidth !== testWidth;
}

/**
 * Get list of unavailable fonts from settings.
 *
 * @param {Object} settings - Font settings object
 * @returns {Promise<string[]>} List of unavailable font names
 */
export async function getUnavailableFonts(settings) {
  const fonts = [settings.fontFamilyPrimary, settings.fontFamilySecondary];
  const unavailable = [];

  for (const font of fonts) {
    if (font && !(await isFontAvailable(font))) {
      unavailable.push(font);
    }
  }

  return unavailable;
}
