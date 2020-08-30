import { Word } from '../interfaces/orc';
import { TextLayerItem, TextLayerType } from '../interfaces/textLayer';

export const buildTextMapFromTextLayer = (
  pdfTextLayer: Array<Word>,
  type: TextLayerType,
  tokenizer?: RegExp,
): Array<TextLayerItem> => {
  const textMap: Array<TextLayerItem> = [];

  if (type === TextLayerType.TEXT_LAYER) {
    let index = 0;
    pdfTextLayer.forEach((textLayerItem) => {
      let offset = 0;
      const { str, fontSize, fontFamily, transform, coords } = textLayerItem;
      str.match(tokenizer!)!.forEach((token) => {
        const textWidth = calculateTextWidth(token, fontSize, fontFamily, transform);
        if (token !== ' ') {
          index += 1;
          textMap.push({
            ...textLayerItem,
            dataI: index,
            str: token,
            coords: {
              left: offset + coords.left,
              top: coords.height,
              width: textWidth,
              height: coords.height,
            }
          });
        }
        offset += textWidth;
      });
    });
  } else {
    pdfTextLayer.forEach((textLayerItem, index) => {
      textMap.push({
        ...textLayerItem,
        dataI: index,
      });
    });
  }

  return textMap;
};

const calculateTextWidth = (text: string, fontSize: number, fontFamily: string, transform: number): number => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context!.font = `${fontSize}px ${fontFamily}`;
  const metrics = context!.measureText(text);
  return metrics.width * transform;
};
