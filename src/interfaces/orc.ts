import { Rectangle } from 'tesseract.js';

export interface OCRWord {
  coords: Rectangle;
  token: string;
  fontSize: number;
  fontFamily: string;
}

export interface OCRResult {
  confidence: number;
  ocrWords: Array<OCRWord>;
}
