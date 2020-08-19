import { useState, useEffect } from 'react';
import { TextMap, TextMapType } from '../interfaces/textMap';
import { Word } from '../interfaces/orc';
import { buildTextMapFromTextLayer } from '../helpers/textMapHelpers';
import { Annotation } from '../interfaces/annotation';

const useTextMap = (annotations: Array<Annotation>) => {
  const [textMap, setTextMap] = useState<Array<TextMap>>([]);

  useEffect(() => {
    const pagesWithAnnotations = Array.from(new Set(annotations.map((annotation) => annotation.page)).values());
    const textMapCleaned = textMap.filter((textMapItem) => pagesWithAnnotations.includes(textMapItem.page));

    if (textMapCleaned.length < textMap.length) {
      setTextMap(textMapCleaned);
    }
  }, [annotations, textMap]);

  const addPageToTextMap = (
    page: number,
    pdfTextLayer: Array<Word>,
    type: TextMapType,
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
  };

  return { textMap, addPageToTextMap };
};

export default useTextMap;
