import { Rectangle } from 'tesseract.js';
import { findIntersectingChildren, isCoordsEmpty } from './selectionHelpers';
import { AnnotationParams } from '../interfaces/annotation';
import { Entity } from '../interfaces/entity';
import { PDFMetaData } from '../interfaces/pdf';

const getImageAsBase64 = (targetCoords: Rectangle, context: CanvasRenderingContext2D): string => {
  const { left, top, width, height } = targetCoords;
  const imageContentRaw = context.getImageData(left, top, width, height);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  canvas.getContext('2d').putImageData(imageContentRaw, 0, 0);
  return  canvas.toDataURL('image/jpeg', 1.0);
};

export const buildNerAnnotation = (pageNumber: number, entity: Entity, selectionChildren, targetCoords: Rectangle): AnnotationParams => {

  const intersects = findIntersectingChildren(selectionChildren, targetCoords);
  const markToAdd: AnnotationParams = {
    page: pageNumber,
    nerAnnotation: {
      tokens: [],
      textIds: [],
    },
    entity: entity!,
    index: entity!.index,
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

export const buildAreaAnnotation = (
  pageNumber: number,
  entity: Entity,
  targetCoords: Rectangle,
  pdfInformation: PDFMetaData,
  context: CanvasRenderingContext2D
): AnnotationParams => {
  if (isCoordsEmpty(targetCoords)) {
    return null;
  }

  return {
    page: pageNumber,
    areaAnnotation: {
      boundingBox: targetCoords,
      pdfInformation,
      base64Image: getImageAsBase64(targetCoords, context),
    },
    entity: entity!
  };
};
