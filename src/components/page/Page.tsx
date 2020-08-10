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
import Token from './token/Token';
import './Page.scss';
import Selection from '../selection/Selection';
import { Entity } from '../../interfaces/entity';
import { Annotation, AnnotationParams } from '../../interfaces/annotation';
import { generateRandomId } from '../../helpers/generalHelpers';
import Mark from './mark/Mark';

interface Props {
  pageNumber: number;
  page: PDFPromise<PDFPageProxy>|null;
  scale: number;
  regex: RegExp;
  annotations: Array<Annotation>;
  addAnnotation: (annotation: AnnotationParams) => void;
  removeAnnotation: (id: string) => void;
  entity?: Entity;
}

const Page = ({
  pageNumber,
  page,
  scale,
  regex,
  annotations,
  addAnnotation,
  removeAnnotation,
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

  const renderTokens = useCallback((tokens: Array<string>, lastIndex: number) => {
    let index = 0;
    return tokens.map((token) => {
      if (token !== ' ') {
        index += 1;
        const dataI = lastIndex + index;
        const annotation = annotations.find((a) => a.textIds.includes(dataI));

        if (annotation) {
          return (
            <Mark
              dataI={dataI}
              token={token}
              annotation={annotation}
              removeAnnotation={removeAnnotation}
              key={generateRandomId(7)}
            />
          );
        }

        return <Token token={token} dataI={dataI} key={generateRandomId(7)} />;
      }

      return <Token token={token} key={generateRandomId(7)} />;
    });
  }, [annotations, removeAnnotation]);

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
        // console.log(lastIndex);

        return token;
      });
    }
    return null;
  }, [regex, text, context, pageViewport, canvasRef, inView, renderTokens]);

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
