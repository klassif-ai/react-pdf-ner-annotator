import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { PDFPageProxy, PDFPageViewport, PDFPromise, TextContent } from 'pdfjs-dist';
import { calculateTextProperties } from '../../helpers/pdfHelpers';
import Token from './token/Token';
import './Page.scss';

interface Props {
  page: PDFPromise<PDFPageProxy>|null;
  scale: number;
}

const Page = ({ page, scale }: Props) => {
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

        return (
          <Token
            key={`${left}-${top}`}
            left={left}
            top={top}
            transform={transform}
            fontSize={fontSize}
            fontFamily={style.fontFamily}
            tokens={item.str.split(' ')}
          />
        );
      });
    }
    return null;
  }, [text, context, pageViewport, canvasRef, inView]);

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
        <div
          className="page__text-layer-container"
          style={{ width: `${pageViewport.width}px`, height: `${pageViewport.height}px` }}
        >
          { renderText }
        </div>
      </div>
    </div>
  );
};

export default Page;
