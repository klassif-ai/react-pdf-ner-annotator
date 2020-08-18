import { TextContentItem } from 'pdfjs-dist';
import { OCRWord } from '../interfaces/orc';
import { TextMapItem, TextMapType } from '../interfaces/textMap';

export const buildTextMapFromTextLayer = (
  pdfTextLayer: Array<TextContentItem|OCRWord>,
  type: TextMapType,
  tokenizer?: RegExp,
): Array<TextMapItem> => {
  const textMap: Array<TextMapItem> = [];

  if (type === TextMapType.TEXT_LAYER) {
    pdfTextLayer.map((textLayerItem) => textLayerItem.str.match(tokenizer!))
      .flat(1)
      .filter(Boolean)
      .forEach((token: string, index) => {
        textMap.push({
          token,
          dataI: index + 1,
        });
        textMap.push({
          token: ' '
        });
      });
    textMap.pop();
  } else {
    pdfTextLayer.forEach((textLayerItem, index) => {
      textMap.push({
        token: textLayerItem.str,
        dataI: index + 1,
      });
      textMap.push({
        token: ' '
      });
    });
    textMap.pop();
  }

  return textMap;
};
