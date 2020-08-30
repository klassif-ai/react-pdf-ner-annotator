import { useState, useEffect, useCallback } from 'react';
import { TextLayer, TextLayerType } from '../interfaces/textLayer';
import { Word } from '../interfaces/orc';
import { buildTextMapFromTextLayer } from '../helpers/textMapHelpers';
import { Annotation } from '../interfaces/annotation';

const useTextMap = (annotations: Array<Annotation>) => {
  const [textMap, setTextMap] = useState<Array<TextLayer>>([]);

  useEffect(() => {
    const pagesWithAnnotations = Array.from(new Set(annotations.map((annotation) => annotation.page)).values());
    const textMapCleaned = textMap.filter((textMapItem) => pagesWithAnnotations.includes(textMapItem.page));

    if (textMapCleaned.length < textMap.length) {
      setTextMap(textMapCleaned);
    }
  }, [annotations, textMap]);

  const addPageToTextMap = useCallback((
    page: number,
    pdfTextLayer: Array<Word>,
    type: TextLayerType,
    confidence: number,
    tokenizer?: RegExp,
  ) => {
    if (!textMap.find((textMapItem) => textMapItem.page === page)) {
      const newTextMap = [
        ...textMap,
        { page, textMapItems: buildTextMapFromTextLayer(pdfTextLayer, type, tokenizer), type, confidence }
      ];
      setTextMap(newTextMap);
    }
  }, [textMap]);

  return { textMap, addPageToTextMap };
};

export default useTextMap;
