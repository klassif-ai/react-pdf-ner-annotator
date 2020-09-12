// @ts-ignore
import lodash from 'lodash';
import * as PdfJs from 'pdfjs-dist/build/pdf';
import { TextContent, TextContentItem } from 'pdfjs-dist';
import { Rectangle } from 'tesseract.js';

const MAX_ALLOWED_DISTANCE = 0.5;

export const calculateTextProperties = (
  textItem: TextContentItem,
  style: any,
  viewPort: any,
  context: CanvasRenderingContext2D
) => {
  const tx = PdfJs.Util.transform(viewPort.transform, textItem.transform);
  let angle = Math.atan2(tx[1], tx[0]);
  if (style.vertical) {
    angle += Math.PI / 2;
  }
  const fontSize = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
  let fontAscent = fontSize;
  if (style.ascent) {
    fontAscent *= style.ascent;
  } else if (style.descent) {
    fontAscent *= (1 + style.descent);
  }

  let left;
  let top;
  if (angle === 0) {
    // eslint-disable-next-line prefer-destructuring
    left = tx[4];
    top = tx[5] - fontAscent;
  } else {
    left = tx[4] + fontAscent * Math.sin(angle);
    top = tx[5] - fontAscent * Math.cos(angle);
  }

  let canvasWidth;

  if (style.vertical) {
    canvasWidth = textItem.height * viewPort.scale;
  } else {
    canvasWidth = textItem.width * viewPort.scale;
  }

  const transform = calculateTransform(
    canvasWidth,
    fontSize,
    style.fontFamily,
    textItem.str,
    context,
  );

  return { left, top, fontSize, transform };
};

export const calculateTransform = (
  canvasWidth: number,
  fontSize: number,
  fontFamily: string,
  text: string,
  context: CanvasRenderingContext2D,
): number => {
  let transform = 1;

  if (canvasWidth) {
    context.font = `${fontSize}px ${fontFamily}`;

    const { width } = context.measureText(text);

    transform = canvasWidth / width;
  }
  return transform;
};

export const calculateFontSize = (width: number, height: number, text: string): number => {
  const area = width * height;
  const { length } = text;

  return Math.sqrt(area / length) * 1.3333;
};

export const recalculateBoundingBox = (coordinates: Rectangle, oldScale: number, newScale: number): Rectangle => {
  return {
    left: (coordinates.left / oldScale)  * newScale,
    top: (coordinates.top / oldScale) * newScale,
    width: (coordinates.width / oldScale)  * newScale,
    height: (coordinates.height / oldScale) * newScale,
  };
};

export const calculateRectangleProperties = (boundingBox: any): Rectangle => {
  const { x0, x1, y0, y1 } = boundingBox;

  const width = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y0 - y0, 2));
  const height = Math.sqrt(Math.pow(x1 - x1, 2) + Math.pow(y1 - y0, 2));

  return { left: x0, top: y0, width, height };
};

export const mergeSplitWords = (textContent: TextContent): TextContent => {
  const { items } = textContent;
  const mergedTextContent: TextContent  = {
    ...textContent,
    items: []
  };

  items.forEach((item) => {
    let prevWidth = 0;
    const sameLevel = items.filter((candidate) => {
      if (filterByDistance(item, candidate, prevWidth)) {
        prevWidth += candidate.width;
        return true;
      }
      return false;
    });
    if (sameLevel.length) {
      mergedTextContent.items.push({
        ...item,
        width: item.width + sameLevel.map((val) => val.width).reduce((a, b) => a + b, 0),
        str: item.str + sameLevel.map((val) => val.str).join(''),
      });
      items.splice(0, items.length, ...items.filter((candidate) => !lodash.includes(sameLevel, candidate)));
    } else {
      mergedTextContent.items.push(item);
    }
  });

  return mergedTextContent;
};

const filterByDistance = (current: TextContentItem, candidate: TextContentItem, addedWidth: number) => {
  const distance = lodash.round(candidate.transform[4] - (current.transform[4] + current.width + addedWidth), 1);
  return current.transform[5] === candidate.transform[5]
    && current.transform[4] < candidate.transform[4]
    && (distance >= -MAX_ALLOWED_DISTANCE && distance <= MAX_ALLOWED_DISTANCE);
};
