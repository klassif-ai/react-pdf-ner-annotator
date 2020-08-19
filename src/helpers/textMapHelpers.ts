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
    // TODO: PDFs with text layers need a different approach for building the textmap
    // pdfTextLayer.forEach((textLayerItem) => {
    //   const { str, coords, fontSize } = textLayerItem;
    //   str.match(tokenizer!)!.forEach((token) => {
    //     if (token) {
    //       index += 1;
    //       textMap.push({
    //         token,
    //         dataI: index,
    //         left: coords.left,
    //         top: coords.top,
    //         width: coords.width,
    //         height: coords.height,
    //         fontSize,
    //       });
    //     } else {
    //       textMap.push({
    //         token,
    //       });
    //     }
    //   });
    // });
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
