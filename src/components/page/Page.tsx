import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { PDFPageProxy, PDFPageViewport, PDFPromise, TextContent } from 'pdfjs-dist';
import { calculateTextProperties } from '../../helpers/pdfHelpers';
import Token from './token/Token';
import './Page.scss';
import Selection from '../selection/Selection';
import { Entity } from '../../interfaces/entity';
import { Annotation, AnnotationParams } from '../../interfaces/annotation';

interface Props {
  pageNumber: number;
  page: PDFPromise<PDFPageProxy>|null;
  scale: number;
  regex: RegExp;
  annotations: Array<Annotation>;
  addAnnotation: (annotation: AnnotationParams) => void;
  entity?: Entity;
}

const Page = ({
  pageNumber,
  page,
  scale,
  regex,
  annotations,
  addAnnotation,
  entity,
}: Props) => {
  const [inViewRef, inView] = useInView({ threshold: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [context, setContext] = useState<CanvasRenderingContext2D|null>(null);
  const [text, setText] = useState<TextContent|null>(null);
  const [pageViewport, setPageViewport] = useState<any>({ width: 0, height: 0 });

  useEffect(() => {
    if (canvasRef) {
      setContext(canvasRef.current!.getContext('2d'));
    }
  }, [canvasRef]);

  useEffect(() => {
    if (canvasRef && context && page) {
      page.then((pdfPage) => {
        pdfPage.getTextContent().then((content) => {
          setText(content);
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

  const renderText = useMemo(() => {
    if (canvasRef && text && inView) {
      let lastIndex = 0;
      return text.items.map((item) => {
        const style = text.styles[item.fontName];
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
        const matches = str.match(regex)!;

        const token = (
          <Token
            key={`${left}-${top}`}
            left={left}
            top={top}
            transform={transform}
            fontSize={fontSize}
            fontFamily={style.fontFamily}
            tokens={matches}
            lastIndex={lastIndex}
          />
        );

        lastIndex += matches.filter((t) => t !== ' ').length;

        return token;
      });
    }
    return null;
  }, [regex, text, context, pageViewport, canvasRef, inView]);

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
        </Selection>
      </div>
    </div>
  );
};

export default Page;
