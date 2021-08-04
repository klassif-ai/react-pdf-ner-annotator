import { Rectangle } from 'tesseract.js';
import { findIntersectingChildren, isCoordsEmpty } from './selectionHelpers';
import { AnnotationParams } from '../interfaces/annotation';
import { Entity } from '../interfaces/entity';
import { PDFMetaData } from '../interfaces/pdf';

export const buildNerAnnotation = (pageNumber: number, entity: Entity, selectionChildren, targetCoords: Rectangle): AnnotationParams => {

  const intersects = findIntersectingChildren(selectionChildren, targetCoords);
  const markToAdd: AnnotationParams = {
    page: pageNumber,
    nerAnnotation: {
      tokens: [],
      textIds: [],
    },
    entity: entity!
  };

  intersects.forEach((intersect) => {
    const offsetX = intersect.offsetLeft;
    const offsetY = intersect.offsetTop;
    findIntersectingChildren(intersect.children, targetCoords, offsetX, offsetY).forEach((child, index) => {
      const dataI = child.getAttribute('data-i');
      if (dataI) {
        markToAdd.nerAnnotation.tokens.push(child.textContent);
        markToAdd.nerAnnotation.textIds.push(parseInt(dataI, 10));
      }
    });
  });

  return markToAdd;
};

export const buildAreaAnnotation = (pageNumber: number, entity: Entity, targetCoords: Rectangle, pdfInformation: PDFMetaData): AnnotationParams => {
  if (isCoordsEmpty(targetCoords)) {
    return null;
  }

  return {
    page: pageNumber,
    areaAnnotation: {
      boundingBox: targetCoords,
      pdfInformation,
    },
    entity: entity!
  };
};
