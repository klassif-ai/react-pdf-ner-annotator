export const findIntersectingChildren = (children: Array<any>, selectionRect: Array<number>, offsetX = 0, offsetY = 0) => {
  return Array.from(children).filter((child) => intersects(child, selectionRect, offsetX, offsetY));
};

const intersects = (child: any, selectionRect: Array<number>, offsetX: number, offsetY: number): boolean => {
  if (Object.values(child.attributes).map((value: any) => value.name).includes('data-ignore')) {
    return false;
  }
  const leftX = Math.max(selectionRect[0], child.offsetLeft + offsetX);
  const rightX = Math.min( selectionRect[0] + selectionRect[2], (child.offsetLeft + offsetX) + child.offsetWidth);
  const topY = Math.max(selectionRect[1], child.offsetTop + offsetY);
  const bottomY = Math.min( selectionRect[1] + selectionRect[3], (child.offsetTop + offsetY) + child.offsetHeight);
  return leftX < rightX && topY < bottomY;
};
