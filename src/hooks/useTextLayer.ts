import { useState, useCallback } from 'react';
import { PDFPageViewport, TextContent } from 'pdfjs-dist';
import sortBy from 'lodash/sortBy';
import { Word } from '../interfaces/orc';
import { calculateTextProperties } from '../helpers/pdfHelpers';


const useTextLayer = (initialTextLayer?: Array<Word>) => {
  const [textLayer, setTextLayer] = useState<Array<Word>|null>(initialTextLayer || null);

  const buildTextLayer = useCallback( (
    textContent: TextContent,
    viewport: PDFPageViewport,
    context: CanvasRenderingContext2D,
  ) => {
    const textResult: Array<Word> = textContent.items.map((item) => {
      const style = textContent.styles[item.fontName];
      const {
        left,
        top,
        fontSize,
        transform,
      } = calculateTextProperties(
        item,
        style,
        viewport,
        context,
      );

      return {
        coords: {
          left,
          top,
          width: item.width,
          height: item.height,
        },
        str: item.str,
        fontSize,
        fontFamily: style.fontFamily,
        transform,
      };
    });
    setTextLayer(sortBy(textResult, ['coords.top', 'coords.left']));
  }, []);

  return { textLayer, buildTextLayer };
};

export default useTextLayer;
