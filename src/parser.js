/**
 * Parse lyrics into slides.
 * Splits by blank lines to create sections.
 * Pairs primary and secondary sections by index.
 *
 * @param {string} primaryLyrics - Raw primary lyrics text
 * @param {string} secondaryLyrics - Raw secondary lyrics text
 * @returns {Array<{id: number, primary: string[], secondary: string[]}>}
 */
export function parseLyrics(primaryLyrics, secondaryLyrics) {
  const primarySections = splitIntoSections(primaryLyrics);
  const secondarySections = splitIntoSections(secondaryLyrics);

  const maxLength = Math.max(primarySections.length, secondarySections.length);
  const slides = [];

  for (let i = 0; i < maxLength; i++) {
    slides.push({
      id: i + 1,
      primary: primarySections[i] || [],
      secondary: secondarySections[i] || []
    });
  }

  return slides;
}

/**
 * Split text into sections by blank lines.
 * Each section is an array of non-empty lines.
 *
 * @param {string} text - Raw text input
 * @returns {Array<string[]>} Array of sections, each section is array of lines
 */
function splitIntoSections(text) {
  if (!text || !text.trim()) {
    return [];
  }

  // Split by one or more blank lines
  const sections = text.split(/\n\s*\n/);

  return sections
    .map(section => {
      // Split section into lines, trim each, filter empty
      return section
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    })
    .filter(section => section.length > 0);
}
