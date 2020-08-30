import { Word } from '../interfaces/orc';
import { TextLayerItem, TextLayerType } from '../interfaces/textLayer';

export const buildTextMapFromTextLayer = (
  pdfTextLayer: Array<Word>,
  type: TextLayerType,
  tokenizer?: RegExp,
): Array<TextLayerItem> => {
  const textMap: Array<TextLayerItem> = [];

  if (type === TextLayerType.TEXT_LAYER) {
    // let index = 0;
    // // TODO: PDFs with text layers need a different approach for building the textmap
    // pdfTextLayer.forEach((textLayerItem) => {
    //   const { str, coords, fontSize } = textLayerItem;
    //   str.match(tokenizer!)!.filter((token) => token).forEach((token) => {
    //     index += 1;
    //     textMap.push({
    //       str: token,
    //       dataI: index,
    //       left: coords.left,
    //       top: coords.top,
    //       width: coords.width,
    //       height: coords.height,
    //       fontSize,
    //     });
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
