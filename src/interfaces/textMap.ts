import { Word } from './orc';

export enum TextMapType {
  TEXT_LAYER = 'TEXT_LAYER',
  ORC = 'OCR',
}

export interface TextMapItem extends Word {
  dataI?: number;
}

export interface TextMap {
  page: number;
  textMapItems: Array<TextMapItem>;
  type: TextMapType;
  confidence: number;
}

