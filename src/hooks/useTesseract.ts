import { useState, useEffect, useCallback } from 'react';
import { createWorker, ImageLike } from 'tesseract.js';
import { OCRResult } from '../interfaces/orc';
import {
  calculateFontSize,
  calculateRectangleProperties, calculateTransform,
  recalculateBoundingBox,
} from '../helpers/pdfHelpers';

const worker = createWorker({
  logger: m => console.log(m),
});

const useTesseract = (scale: number, context: CanvasRenderingContext2D) => {
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string|undefined>(undefined);
  const [ocrResult, setOcrResult] = useState<OCRResult|null>(null);

  useEffect(() => {
    if (ocrResult && ocrResult.baseScale !== scale)  {
      const rescaledWords = ocrResult.ocrWords.map((word) => {
        const coords = recalculateBoundingBox(word.coords, ocrResult.baseScale, scale);
        const fontSize = calculateFontSize(coords.width, coords.height, word.token);
        const transform = calculateTransform(
          coords.width,
          coords.height,
          fontSize,
          word.fontFamily,
          word.token,
          scale,
          context,
        );
        return {
          ...word,
          coords,
          fontSize,
          transform,
        };
      });

      setOcrResult({
        ...ocrResult,
        ocrWords: rescaledWords,
        baseScale: scale,
      });
    }
  }, [ocrResult, scale, context]);

  const doOCR = useCallback(async (image: ImageLike, language = 'eng') => {
    setOcrLoading(true);
    await worker.load();
    await worker.loadLanguage(language);
    await worker.initialize(language);
    return worker.recognize(image)
      .then((result) => {
        setOcrError(undefined);
        setOcrLoading(false);
        setOcrResult({
          confidence: result.data.confidence,
          ocrWords: result.data.words.map((word) => {
            const coords = calculateRectangleProperties(word.bbox);
            const fontSize = calculateFontSize(coords.width, coords.height, word.text);
            const fontFamily = word.font_name || 'sans-serif';
            const transform = calculateTransform(
              coords.width,
              coords.height,
              fontSize,
              fontFamily,
              word.text,
              scale,
              context,
            );
            return {
              coords,
              token: word.text,
              fontSize,
              fontFamily,
              transform,
            };
          }),
          baseScale: scale,
        });
      }, (error) => {
        setOcrResult(null);
        setOcrLoading(false);
        setOcrError(error);
      });
  }, [scale, context]);

  return { ocrResult, ocrError, ocrLoading, doOCR };
};

export default useTesseract;
