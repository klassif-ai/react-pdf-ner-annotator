import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import lodash from 'lodash';
import { useInView } from 'react-intersection-observer';
import { PDFPageProxy, PDFPageViewport, PDFPromise } from 'pdfjs-dist';
import { generateRandomId, getTextMetrics } from '../helpers/generalHelpers';
import { mergeSplitWords } from '../helpers/pdfHelpers';
import { Entity } from '../interfaces/entity';
import { Annotation, AnnotationParams } from '../interfaces/annotation';
import { TextLayerItem, TextLayerType } from '../interfaces/textLayer';
import useTesseract from '../hooks/useTesseract';
import useTextLayer from '../hooks/useTextLayer';
import Mark from './Mark';
import Token from './Token';
import Selection from './Selection';
import OcrInfo from './OcrInfo';
import Loader from './Loader';

interface Props {
  pageNumber: number;
  page: PDFPromise<PDFPageProxy>|null;
  scale: number;
  tokenizer: RegExp;
  disableOCR: boolean;
  annotations: Array<Annotation>;
  addAnnotation: (annotation: AnnotationParams) => void;
  removeAnnotation: (id: string) => void;
  addPageToTextMap: (
    page: number,
    pdfTextLayer: Array<TextLayerItem>,
    type: TextLayerType,
    confidence: number,
    tokenizer?: RegExp,
  ) => void;
  entity?: Entity;
  initialTextLayer?: Array<TextLayerItem>;
}

const Page = ({
  pageNumber,
  page,
  scale,
  tokenizer,
  disableOCR,
  annotations,
  addAnnotation,
  removeAnnotation,
  addPageToTextMap,
  entity,
  initialTextLayer,
}: Props) => {
  const [inViewRef, inView] = useInView({ threshold: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(true);
  const [pdfPage, setPdfPage] = useState<PDFPageProxy|null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D|null>(null);
  const [startOcr, setStartOcr] = useState(false);
  const [pageViewport, setPageViewport] = useState<any>({ width: (916 / 1.5) * scale, height: (1174 / 1.5) * scale });

  const { textLayer, buildTextLayer } = useTextLayer(scale, context!, initialTextLayer);
  const { ocrResult, ocrError, ocrLoading, doOCR } = useTesseract(scale, context!);

  const message = ocrResult ? `OCR confidence ${ocrResult.confidence}%` : undefined;

  useEffect(() => {
    if (annotations.length) {
      if (textLayer) {
        addPageToTextMap(pageNumber, textLayer, TextLayerType.TEXT_LAYER, 1, tokenizer);
        return;
      }
      if (ocrResult) {
        addPageToTextMap(pageNumber, ocrResult.ocrWords, TextLayerType.ORC, ocrResult.confidence);
      }
    }
  }, [annotations, textLayer, ocrResult, pageNumber, addPageToTextMap, tokenizer]);

  useEffect(() => {
    if (!disableOCR && startOcr && inView && !ocrResult) {
      doOCR();
    }
  }, [disableOCR, startOcr, inView, doOCR, ocrResult]);

  useEffect(() => {
    if (canvasRef) {
      setContext(canvasRef.current!.getContext('2d'));
    }
  }, [canvasRef]);

  useEffect(() => {
    if (canvasRef && context && page && inView) {
      page.then((pdfPageResult) => {
        const viewport = pdfPageResult.getViewport({ scale });
        const { width, height } = viewport;
        setPageViewport(viewport);
        const canvas = canvasRef.current;
        canvas!.width = width;
        canvas!.height = height;

        pdfPageResult.render({
          canvasContext: context!,
          viewport,
        }).promise.then(() => {
          setPdfPage(pdfPageResult);
        });
      });
    }
  }, [page, scale, canvasRef, context, inView]);

  useEffect(() => {
    if (inView && pdfPage && !textLayer) {
      pdfPage.getTextContent().then((content) => {
        if (content.items.length) {
          const contentMerged = mergeSplitWords(content);
          buildTextLayer(contentMerged, pageViewport as PDFPageViewport);
        } else {
          setStartOcr(true);
        }
        setLoading(false);
      });
    }
  }, [inView, pdfPage, pageViewport, context, page, textLayer, buildTextLayer]);

  const renderOcrText = useMemo(() => {
    if (ocrResult) {
      return ocrResult.ocrWords.map((ocrWord, index) => {
        const dataI = index + 1;
        const annotation = annotations.find((a) => a.textIds.includes(dataI));
        return (
          <span
            className="token-container"
            style={{
              left: `${ocrWord.coords.left}px`,
              top: `${ocrWord.coords.top}px`,
              width: `${ocrWord.coords.width}px`,
              height: `${ocrWord.coords.height}px`,
              fontSize: `${ocrWord.fontSize}px`,
              transform: `scaleX(${ocrWord.transform})`,
            }}
            key={generateRandomId(7)}
          >
            {
              annotation ? (
                <Mark
                  token={ocrWord.text}
                  annotation={annotation}
                  removeAnnotation={removeAnnotation}
                />
              ) : (
                <Token token={ocrWord.text} dataI={dataI} />
              )
            }
          </span>
        );
      });
    }
    return null;
  }, [ocrResult, annotations, removeAnnotation]);

  const renderTokens = useCallback((tokens: Array<string>, lastIndex: number) => {
    let index = 0;
    let markAsSpace: Annotation | null = null;
    return tokens.map((token) => {
      if (token !== ' ') {
        index += 1;
        const dataI = lastIndex + index;
        const annotation = annotations.find((a) => a.textIds.includes(dataI));

        if (annotation) {
          if (annotation.textIds[annotation.textIds.length - 1] !== dataI) {
            markAsSpace = annotation;
          }
          return (
            <Mark
              token={token}
              annotation={annotation}
              removeAnnotation={removeAnnotation}
              key={generateRandomId(7)}
            />
          );
        }

        return <Token token={token} dataI={dataI} key={generateRandomId(7)} />;
      }

      let space;
      if (markAsSpace) {
        space = (
          <Mark
            token={token}
            annotation={markAsSpace}
            removeAnnotation={removeAnnotation}
            key={generateRandomId(7)}
          />
        );
        markAsSpace = null;
      } else {
        space = <Token token={token} key={generateRandomId(7)} />;
      }

      return space;
    });
  }, [annotations, removeAnnotation]);

  const renderText = useMemo(() => {
    if (canvasRef && textLayer && inView) {
      let lastIndex = 0;
      return textLayer.map((item) => {
        const { text, coords, fontFamily, fontSize, transform } = item;
        const metrics = getTextMetrics(text, 12)

        const scale = {
          'x': coords.width/metrics.width,
          'y': coords.height/metrics.height
        }

        const matches = lodash.deburr(text).match(tokenizer)!;
        const token = (
          <span
            className="token-container"
            style={{
              left: `${coords.left}px`,
              top: `${coords.top}px`,
              width: `${coords.width}px`,
              height: `${coords.height}px`,
              fontSize: `${12}px`,
              transform: `scale(${scale.x}, ${scale.y})`,
            }}
            key={generateRandomId(7)}
          >
            { renderTokens(matches, lastIndex) }
          </span>
        );

        lastIndex += matches.filter((t) => t !== ' ').length;
        return token;
      });
    }
    return null;
  }, [tokenizer, textLayer, canvasRef, inView, renderTokens]);

  return (
    <div className="page" ref={inViewRef}>
      <div
        className="page__container"
        style={{ width: `${pageViewport.width}px`, height: `${pageViewport.height}px` }}
      >
        <div
          className="page__canvas-container"
          style={{ width: `${pageViewport.width}px`, height: `${pageViewport.height}px` }}
        >
          { loading ? <Loader /> : null }
          <canvas
            ref={canvasRef}
            style={{ width: `${pageViewport.width}px`, height: `${pageViewport.height}px` }}
          />
        </div>
        <Selection
          pageNumber={pageNumber}
          className="page__text-layer-container"
          style={{ width: `${pageViewport.width}px`, height: `${pageViewport.height}px` }}
          entity={entity}
          addAnnotation={addAnnotation}
        >
          { renderText }
          { renderOcrText }
          <OcrInfo loading={ocrLoading} message={message} error={ocrError} />
        </Selection>
      </div>
    </div>
  );
};

export default Page;
