import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useInView } from 'react-intersection-observer';
import { PDFPageProxy, PDFPageViewport, PDFPromise } from 'pdfjs-dist';
import { calculateTextProperties } from '../../helpers/pdfHelpers';
import { generateRandomId } from '../../helpers/generalHelpers';
import { Entity } from '../../interfaces/entity';
import { Annotation, AnnotationParams } from '../../interfaces/annotation';
import useTesseract from '../../hooks/useTesseract';
import Mark from './mark/Mark';
import Token from './token/Token';
import Selection from '../selection/Selection';
import OcrInfo from './ocrInfo/OcrInfo';
import './Page.scss';
import { Word } from '../../interfaces/orc';
import { TextMapType } from '../../interfaces/textMap';

interface Props {
  pageNumber: number;
  page: PDFPromise<PDFPageProxy>|null;
  scale: number;
  tokenizer: RegExp;
  disableOCR: boolean;
  annotations: Array<Annotation>;
  addAnnotation: (annotation: AnnotationParams) => void;
  removeAnnotation: (id: string) => void;
  addTextMapPage: (
    page: number,
    pdfTextLayer: Array<Word>,
    type: TextMapType,
    confidence: number,
    tokenizer?: RegExp,
  ) => void;
  entity?: Entity;
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
  addTextMapPage,
  entity,
}: Props) => {
  const [inViewRef, inView] = useInView({ threshold: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [context, setContext] = useState<CanvasRenderingContext2D|null>(null);
  const [textContent, setTextContent] = useState<Array<Word>|null>(null);
  const [startOcr, setStartOcr] = useState(false);
  const [pageViewport, setPageViewport] = useState<any>({ width: 0, height: 0 });

  const { ocrResult, ocrError, ocrLoading, doOCR } = useTesseract(scale, context!);

  const message = ocrResult ? `OCR confidence ${ocrResult.confidence}%` : undefined;

  useEffect(() => {
    if (annotations.length) {
      if (textContent) {
        addTextMapPage(pageNumber, textContent, TextMapType.TEXT_LAYER, 1, tokenizer);
        return;
      }
      if (ocrResult) {
        addTextMapPage(pageNumber, ocrResult.ocrWords, TextMapType.ORC, ocrResult.confidence);
      }
    }
  }, [annotations, textContent, ocrResult, pageNumber, addTextMapPage, tokenizer]);

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
      page.then((pdfPage) => {
        const viewport = pdfPage.getViewport({ scale });
        pdfPage.getTextContent().then((content) => {
          if (content.items.length) {
            const textResult: Array<Word> = content.items.map((item) => {
              const style = content.styles[item.fontName];
              const {
                left,
                top,
                fontSize,
                transform,
              } = calculateTextProperties(
                item,
                style,
                viewport as PDFPageViewport,
                context!,
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
            setTextContent(sortBy(textResult, ['coords.top', 'coords.left']));
          } else {
            setStartOcr(true);
          }
        });

        const { width, height } = viewport;
        setPageViewport(viewport);
        const canvas = canvasRef.current;
        canvas!.width = width;
        canvas!.height = height;

        pdfPage.render({
          canvasContext: context!,
          viewport,
        });
      });
    }
  }, [page, scale, canvasRef, context, inView]);

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
                  token={ocrWord.str}
                  annotation={annotation}
                  removeAnnotation={removeAnnotation}
                />
              ) : (
                <Token token={ocrWord.str} dataI={dataI} />
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
    if (canvasRef && textContent && inView) {
      let lastIndex = 0;
      return textContent.map((item) => {

        const { str, coords, fontFamily, fontSize, transform } = item;
        const matches = str.match(tokenizer)!;

        const token = (
          <span
            className="token-container"
            style={{
              left: `${coords.left}px`,
              top: `${coords.top}px`,
              fontSize: `${fontSize}px`,
              fontFamily: `${fontFamily}`,
              transform: `scaleX(${transform})`,
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
  }, [tokenizer, textContent, canvasRef, inView, renderTokens]);

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
