import { updateSettings } from './state.js';
import { clampFontSize } from './validation.js';

export function initControls() {
  // Background color
  const bgColor = document.getElementById('bg-color');
  bgColor.addEventListener('input', (e) => {
    updateSettings({ backgroundColor: e.target.value });
  });

  // Primary font settings
  const fontPrimary = document.getElementById('font-primary');
  const sizePrimary = document.getElementById('size-primary');
  const colorPrimary = document.getElementById('color-primary');

  fontPrimary.addEventListener('input', (e) => {
    updateSettings({ fontFamilyPrimary: e.target.value });
  });

  sizePrimary.addEventListener('input', (e) => {
    const size = clampFontSize(e.target.value);
    e.target.value = size; // Update displayed value to clamped value
    updateSettings({ fontSizePrimary: size });
  });

  sizePrimary.addEventListener('blur', (e) => {
    // Ensure valid value on blur
    const size = clampFontSize(e.target.value);
    e.target.value = size;
    updateSettings({ fontSizePrimary: size });
  });

  colorPrimary.addEventListener('input', (e) => {
    updateSettings({ fontColorPrimary: e.target.value });
  });

  // Secondary font settings
  const fontSecondary = document.getElementById('font-secondary');
  const sizeSecondary = document.getElementById('size-secondary');
  const colorSecondary = document.getElementById('color-secondary');

  fontSecondary.addEventListener('input', (e) => {
    updateSettings({ fontFamilySecondary: e.target.value });
  });

  sizeSecondary.addEventListener('input', (e) => {
    const size = clampFontSize(e.target.value);
    e.target.value = size;
    updateSettings({ fontSizeSecondary: size });
  });

  sizeSecondary.addEventListener('blur', (e) => {
    const size = clampFontSize(e.target.value);
    e.target.value = size;
    updateSettings({ fontSizeSecondary: size });
  });

  colorSecondary.addEventListener('input', (e) => {
    updateSettings({ fontColorSecondary: e.target.value });
  });
}
