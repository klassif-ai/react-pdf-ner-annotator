import { Rectangle } from 'tesseract.js';

export interface OCRWord {
  coords: Rectangle;
  token: string;
  fontSize: number;
  fontFamily: string;
  transform: number;
}

export interface OCRResult {
  confidence: number;
  ocrWords: Array<OCRWord>;
  baseScale: number;
}
