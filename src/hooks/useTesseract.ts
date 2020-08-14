import { useState, useCallback } from 'react';
import { createWorker, ImageLike } from 'tesseract.js';
import { OCRResult } from '../interfaces/orc';
import { calculateRectangleProperties } from '../helpers/pdfHelpers';

const worker = createWorker({
  logger: m => console.log(m),
});

const useTesseract = () => {
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<any>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult|null>(null);

  const doOCR = useCallback(async (image: ImageLike, language = 'eng') => {
    setOcrLoading(true);
    await worker.load();
    await worker.loadLanguage(language);
    await worker.initialize(language);
    return worker.recognize(image)
      .then((result) => {
        setOcrError(null);
        setOcrLoading(false);
        setOcrResult({
          confidence: result.data.confidence,
          ocrWords: result.data.words.map((word) => ({
            coords: calculateRectangleProperties(word.bbox),
            token: word.text,
            fontSize: word.font_size,
            fontFamily: word.font_name,
          })),
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
