import { Word } from '../interfaces/orc';
import { TextMapItem, TextMapType } from '../interfaces/textMap';

export const buildTextMapFromTextLayer = (
  pdfTextLayer: Array<Word>,
  type: TextMapType,
  tokenizer?: RegExp,
): Array<TextMapItem> => {
  const textMap: Array<TextMapItem> = [];

  if (type === TextMapType.TEXT_LAYER) {
    let index = 0;
    pdfTextLayer.forEach((textLayerItem) => {
      const { str, coords, fontSize } = textLayerItem;
      str.match(tokenizer!)!.forEach((token) => {
        if (token) {
          index += 1;
          textMap.push({
            token,
            dataI: index,
            left: coords.left,
            top: coords.top,
            // TODO: this width and height is for the entire text paragraph, calculate this for words separately
            width: coords.width,
            height: coords.height,
            fontSize,
          });
        } else {
          textMap.push({
            token,
          });
        }
      });
    });
  } else {
    pdfTextLayer.forEach((textLayerItem, index) => {
      const { str, coords, fontSize } = textLayerItem;
      textMap.push({
        token: str,
        dataI: index + 1,
        left: coords.left,
        top: coords.top,
        width: coords.width,
        height: coords.height,
        fontSize,
      });
      textMap.push({
        token: ' '
      });
    });
    textMap.pop();
  }

  return textMap;
};
