// Loaded before the unit tests. The Angular unit-test builder initializes
// the TestBed environment. This file patches Zone.js and gives jsdom enough of
// a canvas for Phaser's startup feature checks.
import 'zone.js/testing';

const context2d = {
  fillStyle: '',
  globalCompositeOperation: 'source-over',
  fillRect(): void {},
  drawImage(): void {},
  getImageData(): ImageData {
    return { data: new Uint8ClampedArray(4) } as ImageData;
  },
  putImageData(): void {},
};

if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = (() => context2d) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}
