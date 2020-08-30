import { Word } from './orc';

export enum TextLayerType {
  TEXT_LAYER = 'TEXT_LAYER',
  ORC = 'OCR',
}

export interface TextLayerItem extends Word {
  dataI?: number;
}

export interface TextLayer {
  page: number;
  textMapItems: Array<TextLayerItem>;
  type: TextLayerType;
  confidence: number;
}
