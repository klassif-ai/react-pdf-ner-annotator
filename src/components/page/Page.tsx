import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useInView } from 'react-intersection-observer';
import { PDFPageProxy, PDFPageViewport, PDFPromise, TextContent } from 'pdfjs-dist';
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

interface Props {
  pageNumber: number;
  page: PDFPromise<PDFPageProxy>|null;
  scale: number;
  tokenizer: RegExp;
  disableOCR: boolean;
  annotations: Array<Annotation>;
  addAnnotation: (annotation: AnnotationParams) => void;
  removeAnnotation: (id: string) => void;
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
  entity,
}: Props) => {
  const [inViewRef, inView] = useInView({ threshold: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [context, setContext] = useState<CanvasRenderingContext2D|null>(null);
  const [textContent, setTextContent] = useState<TextContent|null>(null);
  const [pageViewport, setPageViewport] = useState<any>({ width: 0, height: 0 });

  const { ocrResult, ocrError, ocrLoading, doOCR } = useTesseract(scale, context!);

  const message = ocrResult ? `OCR confidence ${ocrResult.confidence}%` : undefined;

  useEffect(() => {
    if (!disableOCR && !textContent && inView && !ocrResult) {
      doOCR();
    }
  }, [disableOCR, textContent, inView, doOCR, ocrResult]);

  useEffect(() => {
    if (canvasRef) {
      setContext(canvasRef.current!.getContext('2d'));
    }
  }, [canvasRef]);

  useEffect(() => {
    if (canvasRef && context && page) {
      page.then((pdfPage) => {
        pdfPage.getTextContent().then((content) => {
          if (content.items.length) {
            setTextContent(content);
          }
        });

        const viewport = pdfPage.getViewport({ scale });
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
  }, [page, scale, canvasRef, context]);

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
                  token={ocrWord.token}
                  annotation={annotation}
                  removeAnnotation={removeAnnotation}
                />
              ) : (
                <Token token={ocrWord.token} dataI={dataI} />
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
      return textContent.items.map((item) => {
        const style = textContent.styles[item.fontName];
        const {
          left,
          top,
          fontSize,
          transform,
        } = calculateTextProperties(
          item,
          style,
          pageViewport as PDFPageViewport,
          context!,
        );

        const { str } = item;
        const matches = str.match(tokenizer)!;

        const token = (
          <span
            className="token-container"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              fontSize: `${fontSize}px`,
              fontFamily: `${style.fontFamily}`,
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
  }, [tokenizer, textContent, context, pageViewport, canvasRef, inView, renderTokens]);

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
