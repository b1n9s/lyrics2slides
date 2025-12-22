import { state, subscribe } from './state.js';
import { getUnavailableFonts } from './fonts.js';
import { PPTX_SLIDE_HEIGHT_PT } from './constants.js';

// DOM elements
let slidePreview;
let primaryText;
let secondaryText;
let slideCounter;
let fontWarning;

// Track last checked fonts to avoid repeated warnings
let lastCheckedFonts = '';

export function initPreview() {
  slidePreview = document.getElementById('slide-preview');
  primaryText = document.getElementById('primary-text');
  secondaryText = document.getElementById('secondary-text');
  slideCounter = document.getElementById('slide-counter');

  // Create font warning element
  fontWarning = document.createElement('div');
  fontWarning.id = 'font-warning';
  fontWarning.className = 'font-warning';
  fontWarning.setAttribute('role', 'alert');
  fontWarning.style.display = 'none';
  slidePreview.parentElement.insertBefore(fontWarning, slidePreview);

  // Subscribe to state changes
  subscribe(renderPreview);

  // Re-render on window resize to recalculate font scale
  window.addEventListener('resize', () => renderPreview(state));

  // Initial render
  renderPreview(state);
}

/**
 * Calculate the font scale factor based on preview size vs actual PPTX slide size.
 * This ensures the preview accurately represents how text will appear in the exported PPTX.
 */
function getFontScale() {
  const previewHeight = slidePreview.clientHeight;
  // Scale factor: preview pixels / PPTX points
  return previewHeight / PPTX_SLIDE_HEIGHT_PT;
}

async function checkFonts(settings) {
  const fontKey = `${settings.fontFamilyPrimary}|${settings.fontFamilySecondary}`;
  if (fontKey === lastCheckedFonts) return;
  lastCheckedFonts = fontKey;

  const unavailable = await getUnavailableFonts(settings);
  if (unavailable.length > 0) {
    fontWarning.textContent = `Font not found: ${unavailable.join(', ')}. Preview may not match export.`;
    fontWarning.style.display = 'block';
  } else {
    fontWarning.style.display = 'none';
  }
}

function renderPreview(state) {
  const { slides, currentSlide, settings } = state;

  // Check fonts asynchronously
  checkFonts(settings);

  // Update background
  slidePreview.style.backgroundColor = settings.backgroundColor;

  // Handle empty state
  if (slides.length === 0) {
    primaryText.textContent = '';
    secondaryText.textContent = '';
    slideCounter.textContent = '0 / 0';
    slidePreview.classList.add('empty');
    primaryText.classList.remove('centered');
    secondaryText.classList.remove('centered');
    return;
  }

  slidePreview.classList.remove('empty');

  const slide = slides[currentSlide];
  if (!slide) return;

  // Calculate font scale based on preview size
  const fontScale = getFontScale();

  const primarySettings = {
    font: settings.fontFamilyPrimary,
    size: settings.fontSizePrimary,
    color: settings.fontColorPrimary
  };

  const secondarySettings = {
    font: settings.fontFamilySecondary,
    size: settings.fontSizeSecondary,
    color: settings.fontColorSecondary
  };

  // Check if only primary has content (secondary should be empty if primary is empty)
  const hasPrimary = slide.primary.length > 0;
  const hasSecondary = slide.secondary.length > 0;
  const onlyPrimary = hasPrimary && !hasSecondary;

  // Reset centering classes
  primaryText.classList.remove('centered');
  secondaryText.classList.remove('centered');

  if (onlyPrimary) {
    // Only primary - center it
    primaryText.classList.add('centered');
    primaryText.textContent = slide.primary.join('\n');
    primaryText.style.fontFamily = primarySettings.font;
    primaryText.style.fontSize = `${primarySettings.size * fontScale}px`;
    primaryText.style.color = primarySettings.color;
    secondaryText.textContent = '';
  } else {
    // Both languages - use normal split layout
    primaryText.textContent = slide.primary.join('\n');
    primaryText.style.fontFamily = primarySettings.font;
    primaryText.style.fontSize = `${primarySettings.size * fontScale}px`;
    primaryText.style.color = primarySettings.color;

    secondaryText.textContent = slide.secondary.join('\n');
    secondaryText.style.fontFamily = secondarySettings.font;
    secondaryText.style.fontSize = `${secondarySettings.size * fontScale}px`;
    secondaryText.style.color = secondarySettings.color;
  }

  // Update counter
  slideCounter.textContent = `${currentSlide + 1} / ${slides.length}`;
}
