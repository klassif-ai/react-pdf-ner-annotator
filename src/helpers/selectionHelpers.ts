import { Rectangle } from 'tesseract.js';
import { Point } from '../interfaces/point';
export const isCoordsEmpty = (coordinates: Rectangle): boolean => {
  return coordinates.width * coordinates.height <= 0;
};

export const calculateSelectionRectangle = (startPoint: Point, endPoint: Point): Rectangle => {
  const x3 = Math.min(startPoint.x, endPoint.x);
  const x4 = Math.max(startPoint.x, endPoint.x);
  const y3 = Math.min(startPoint.y, endPoint.y);
  const y4 = Math.max(startPoint.y, endPoint.y);

  return { left: x3, top: y3, width: (x4 - x3), height: (y4 - y3) };
};

export const findIntersectingChildren = (children: Array<any>, selectionRect: Rectangle,
  offsetX = 0, offsetY = 0, offsetScale = {'x':1, 'y':1}) => {
  // Get selection rectangle coordinates
  let selectionRectangle = {
    'left': selectionRect.left,
    'right': selectionRect.left + selectionRect.width,
    'top': selectionRect.top,
    'bottom': selectionRect.top + selectionRect.height
  }

  // Filter children on intersection
  return Array.from(children).filter((child) => intersects(child, selectionRectangle, offsetX, offsetY, offsetScale));
};


const intersects = (child: any, selectionRectangle, offsetX: number, offsetY: number, offsetScale): boolean => {
  // Ignore irrelvant children
  if (Object.values(child.attributes).map((value: any) => value.name).includes('data-ignore')) {
    return false;
  }

  // Get rescaled child rectangle
  let childRectangle = {
    'left': offsetX + offsetScale.x*child.offsetLeft ,
    'right': offsetX + offsetScale.x*child.offsetLeft + offsetScale.x*child.offsetWidth,
    'top': offsetY + child.offsetTop,
    'bottom': offsetY + child.offsetTop + offsetScale.y*child.offsetHeight
  }

  // Check if rectangles intersect
  return !(selectionRectangle.left > childRectangle.right
          || selectionRectangle.right < childRectangle.left
          || selectionRectangle.top > childRectangle.bottom
          || selectionRectangle.bottom < childRectangle.top);
};
