import { Rectangle } from 'tesseract.js';

export enum TextLayerType {
  TEXT_LAYER = 'TEXT_LAYER',
  ORC = 'OCR',
}

export interface TextLayerItem {
  dataI?: number;
  coords: Rectangle;
  text: string;
  fontSize: number;
  fontFamily: string;
  transform: number;
}

export interface TextLayer {
  page: number;
  textMapItems: Array<TextLayerItem>;
  type: TextLayerType;
  confidence: number;
}
