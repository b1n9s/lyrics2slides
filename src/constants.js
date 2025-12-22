// PPTX slide dimensions (16:9 widescreen)
export const PPTX_SLIDE_WIDTH_INCHES = 13.333;
export const PPTX_SLIDE_HEIGHT_INCHES = 7.5;
export const POINTS_PER_INCH = 72;

// Derived values
export const PPTX_SLIDE_HEIGHT_PT = PPTX_SLIDE_HEIGHT_INCHES * POINTS_PER_INCH; // 540

// Layout percentages (matching between preview and export)
export const LAYOUT = {
  MARGIN_PERCENT: 5,
  PRIMARY_TOP_PERCENT: 5,
  PRIMARY_HEIGHT_PERCENT: 43,
  SECONDARY_TOP_PERCENT: 52,
  SECONDARY_HEIGHT_PERCENT: 43,
  CONTENT_WIDTH_PERCENT: 90,
  CENTERED_HEIGHT_PERCENT: 90
};

// Debounce delay in milliseconds
export const DEBOUNCE_MS = 150;
