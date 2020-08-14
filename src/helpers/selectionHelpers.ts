import { Rectangle } from 'tesseract.js';

export const findIntersectingChildren = (children: Array<any>, selectionRect: Rectangle, offsetX = 0, offsetY = 0) => {
  return Array.from(children).filter((child) => intersects(child, selectionRect, offsetX, offsetY));
};

const intersects = (child: any, selectionRect: Rectangle, offsetX: number, offsetY: number): boolean => {
  if (Object.values(child.attributes).map((value: any) => value.name).includes('data-ignore')) {
    return false;
  }
  const leftX = Math.max(selectionRect.left, child.offsetLeft + offsetX);
  const rightX = Math.min( selectionRect.left + selectionRect.width, (child.offsetLeft + offsetX) + child.offsetWidth);
  const topY = Math.max(selectionRect.top, child.offsetTop + offsetY);
  const bottomY = Math.min( selectionRect.top + selectionRect.height, (child.offsetTop + offsetY) + child.offsetHeight);
  return leftX < rightX && topY < bottomY;
};
