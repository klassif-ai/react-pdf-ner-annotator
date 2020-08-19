import { Rectangle } from 'tesseract.js';

export interface Word {
  coords: Rectangle;
  str: string;
  fontSize: number;
  fontFamily: string;
  transform: number;
}

export interface OCRResult {
  confidence: number;
  ocrWords: Array<Word>;
  baseScale: number;
}
