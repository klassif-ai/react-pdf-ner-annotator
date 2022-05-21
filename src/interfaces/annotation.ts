import { Rectangle } from 'tesseract.js';
import { Entity } from './entity';
import { PDFMetaData } from './pdf';

export interface Annotation extends AnnotationParams {
  id: number;
}

export interface AnnotationParams {
  entity: Entity;
  page: number;
  nerAnnotation?: NerAnnotation;
  areaAnnotation?: AreaAnnotation;
  score?: number;
  index?: number;
}

interface NerAnnotation {
  textIds: Array<number>;
  tokens: Array<string>;
}

interface AreaAnnotation {
  boundingBox: Rectangle;
  pdfInformation: PDFMetaData;
  text?: string;
  base64Image?: string;
}
