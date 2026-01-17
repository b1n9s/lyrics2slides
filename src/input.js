import { state, setSlides, setPrimaryLyrics, setSecondaryLyrics, updateSettings } from './state.js';
import { parseLyrics } from './parser.js';

let primaryTextarea;
let secondaryTextarea;
let secondaryGroup;
let secondaryHasBeenUsed = false;

function setSecondaryEnabled(enabled) {
  secondaryTextarea.disabled = !enabled;

  if (enabled) {
    secondaryGroup.style.opacity = '1';
    secondaryGroup.style.pointerEvents = 'auto';
  } else {
    secondaryGroup.style.opacity = '0.4';
    secondaryGroup.style.pointerEvents = 'none';
    secondaryTextarea.value = '';
    setSecondaryLyrics('');
  }
}

export function initInput() {
  primaryTextarea = document.getElementById('primary-lyrics');
  secondaryTextarea = document.getElementById('secondary-lyrics');
  secondaryGroup = document.getElementById('secondary-group');

  // Debounce timer
  let debounceTimer;

  function handleInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // Use proper setters instead of direct mutation
      setPrimaryLyrics(primaryTextarea.value);
      setSecondaryLyrics(secondaryTextarea.value);

      // Enable/disable secondary based on primary content
      const hasPrimary = primaryTextarea.value.trim().length > 0;
      setSecondaryEnabled(hasPrimary);

      // When secondary is first used, set both font sizes to 40
      const hasSecondary = secondaryTextarea.value.trim().length > 0;
      if (hasSecondary && !secondaryHasBeenUsed) {
        secondaryHasBeenUsed = true;
        updateSettings({ fontSizePrimary: 40, fontSizeSecondary: 40 });
        // Update the UI inputs
        document.getElementById('size-primary').value = 40;
        document.getElementById('size-secondary').value = 40;
      }

      const slides = parseLyrics(state.primaryLyrics, state.secondaryLyrics);
      setSlides(slides);
    }, 150);
  }

  primaryTextarea.addEventListener('input', handleInput);
  secondaryTextarea.addEventListener('input', handleInput);

  // Initial state - secondary disabled
  setSecondaryEnabled(false);
}
