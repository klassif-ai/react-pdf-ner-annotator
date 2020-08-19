export enum TextMapType {
  TEXT_LAYER = 'TEXT_LAYER',
  ORC = 'OCR',
}

export interface TextMapItem {
  token: string;
  dataI?: number;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  fontSize?: number;
}

export interface TextMap {
  page: number;
  textMapItems: Array<TextMapItem>;
  type: TextMapType;
  confidence: number;
}

