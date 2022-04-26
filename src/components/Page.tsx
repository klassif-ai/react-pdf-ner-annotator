import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { PDFPageProxy, PDFPageViewport } from 'pdfjs-dist';
import { mergeSplitWords } from '../helpers/pdfHelpers';
import { Entity } from '../interfaces/entity';
import { Annotation, AnnotationParams } from '../interfaces/annotation';
import { TextLayerItem, TextLayerType } from '../interfaces/textLayer';
import useTesseract from '../hooks/useTesseract';
import useTextLayer from '../hooks/useTextLayer';
import Selection from './Selection';
import OcrInfo from './OcrInfo';
import Loader from './Loader';
import TextLayer from './textLayer/TextLayer';
import AreaLayer from './areaLayer/AreaLayer';

interface Props {
  pageNumber: number;
  page: Promise<PDFPageProxy>|null;
  scale: number;
  tokenizer: RegExp;
  disableOCR: boolean;
  annotations: Array<Annotation>;
  addAnnotation: (annotation: AnnotationParams) => void;
  updateAnnotation: (annotation: Annotation) => void;
  updateLastAnnotationForEntity: (annotation: AnnotationParams) => void;
  removeAnnotation: (id: number) => void;
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
  updateAnnotation,
  updateLastAnnotationForEntity,
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
    if (textLayer?.length) {
      setLoading(false);
      return;
    }
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
          updateLastAnnotationForEntity={updateLastAnnotationForEntity}
          pdfInformation={{ width: pageViewport.width, height: pageViewport.height, scale }}
          pdfContext={context}
        >
          <TextLayer
            inView={inView}
            canvasInitialized={!!canvasRef}
            isAnnotating={entity?.entityType === 'NER'}
            textLayer={textLayer || ocrResult?.ocrWords}
            tokenizer={tokenizer}
            needsTokenization={!initialTextLayer}
            annotations={annotations.filter((annotation) => !!annotation.nerAnnotation)}
            removeAnnotation={removeAnnotation}
          />
          <AreaLayer
            pdfScale={scale}
            annotations={annotations.filter((annotation) => !!annotation.areaAnnotation)}
            removeAnnotation={removeAnnotation}
            updateAnnotation={updateAnnotation}
          />
          <div className="ocr-info-container">
            <OcrInfo loading={ocrLoading} message={message} error={ocrError} />
          </div>
        </Selection>
      </div>
    </div>
  );
};

export default Page;
