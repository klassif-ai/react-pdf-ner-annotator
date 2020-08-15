import { useState, useEffect, useCallback } from 'react';
import { createWorker, ImageLike } from 'tesseract.js';
import { OCRResult } from '../interfaces/orc';
import { calculateRectangleProperties } from '../helpers/pdfHelpers';

const worker = createWorker({
  logger: m => console.log(m),
});

const useTesseract = (scale: number) => {
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string|undefined>(undefined);
  const [ocrResult, setOcrResult] = useState<OCRResult|null>(null);

  useEffect(() => {
    if (ocrResult && ocrResult.baseScale !== scale)  {
      const rescaledWords = ocrResult.ocrWords.map((word) => ({
        ...word,
        coords: {
          left: Math.round((word.coords.left / ocrResult.baseScale)  * scale),
          top: Math.round((word.coords.top / ocrResult.baseScale) * scale),
          width: Math.round((word.coords.width / ocrResult.baseScale)  * scale),
          height: Math.round((word.coords.height / ocrResult.baseScale) * scale),
        }
      }));

      setOcrResult({
        ...ocrResult,
        ocrWords: rescaledWords,
        baseScale: scale,
      });
    }
  }, [ocrResult, scale]);

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
          ocrWords: result.data.words.map((word) => ({
            coords: calculateRectangleProperties(word.bbox),
            token: word.text,
            fontSize: word.font_size,
            fontFamily: word.font_name,
          })),
          baseScale: scale,
        });
      }, (error) => {
        setOcrResult(null);
        setOcrLoading(false);
        setOcrError(error);
      });
  }, []);

  return { ocrResult, ocrError, ocrLoading, doOCR };
};

export default useTesseract;
