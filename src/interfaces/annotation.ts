import { Rectangle } from 'tesseract.js';
import { Entity } from './entity';
import { PDFMetaData } from './pdf';

export interface Annotation extends AnnotationParams {
  id: number;
}

export interface AnnotationParams {
  entity: Entity;
  nerAnnotation?: NerAnnotation;
  areaAnnotation?: AreaAnnotation;
  page: number;
}

interface NerAnnotation {
  textIds: Array<number>;
  tokens: Array<string>;
}

interface AreaAnnotation {
  boundingBox: Rectangle;
  pdfInformation: PDFMetaData;
  text?: string;
}
