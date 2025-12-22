import { describe, it, expect, beforeEach, vi } from 'vitest';

// Reset module state between tests
let stateModule;

describe('state module', () => {
  beforeEach(async () => {
    vi.resetModules();
    stateModule = await import('./state.js');
  });

  describe('setPrimaryLyrics', () => {
    it('updates primary lyrics and notifies', () => {
      const listener = vi.fn();
      stateModule.subscribe(listener);

      stateModule.setPrimaryLyrics('Test lyrics');

      expect(stateModule.state.primaryLyrics).toBe('Test lyrics');
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('setSecondaryLyrics', () => {
    it('updates secondary lyrics and notifies', () => {
      const listener = vi.fn();
      stateModule.subscribe(listener);

      stateModule.setSecondaryLyrics('Secondary text');

      expect(stateModule.state.secondaryLyrics).toBe('Secondary text');
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('setSlides', () => {
    it('updates slides and clamps currentSlide', () => {
      stateModule.state.currentSlide = 5;

      stateModule.setSlides([{ id: 1 }, { id: 2 }]);

      expect(stateModule.state.slides).toHaveLength(2);
      expect(stateModule.state.currentSlide).toBe(1); // Clamped to max index
    });

    it('sets currentSlide to 0 for empty slides', () => {
      stateModule.setSlides([]);

      expect(stateModule.state.currentSlide).toBe(0);
    });
  });

  describe('navigation', () => {
    beforeEach(() => {
      stateModule.setSlides([{ id: 1 }, { id: 2 }, { id: 3 }]);
      stateModule.setCurrentSlide(1);
    });

    it('nextSlide increments within bounds', () => {
      stateModule.nextSlide();
      expect(stateModule.state.currentSlide).toBe(2);
    });

    it('nextSlide does not exceed max', () => {
      stateModule.setCurrentSlide(2);
      stateModule.nextSlide();
      expect(stateModule.state.currentSlide).toBe(2);
    });

    it('prevSlide decrements within bounds', () => {
      stateModule.prevSlide();
      expect(stateModule.state.currentSlide).toBe(0);
    });

    it('prevSlide does not go below 0', () => {
      stateModule.setCurrentSlide(0);
      stateModule.prevSlide();
      expect(stateModule.state.currentSlide).toBe(0);
    });
  });

  describe('subscribe', () => {
    it('returns unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = stateModule.subscribe(listener);

      stateModule.notify();
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      stateModule.notify();
      expect(listener).toHaveBeenCalledTimes(1); // Not called again
    });
  });
});
