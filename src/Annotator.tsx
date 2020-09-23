import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  Ref,
} from 'react';
import usePDF from './hooks/usePDF';
import useAnnotations from './hooks/useAnnotations';
import useTextMap from './hooks/useTextMap';
import Page from './components/Page';
import Error from './components/Error';
import ButtonGroup from './components/ButtonGroup';
import { Entity } from './interfaces/entity';
import { Annotation } from './interfaces/annotation';
import { TextLayer, TextLayerItem } from './interfaces/textLayer';

interface Props {
  url?: string;
  data?: Uint8Array | BufferSource | string;
  httpHeaders?: {
    [key: string]: string;
  };
  initialScale?: number;
  tokenizer?: RegExp;
  disableOCR?: boolean;
  entity?: Entity;
  initialTextMap?: Array<TextLayer>;
  defaultAnnotations?: Array<Annotation>,
  getAnnotations(annotations: Array<Annotation>): void
  getTextMaps?(textMaps: Array<TextLayer>): void;
}

const Annotator = forwardRef(({
  url,
  data,
  httpHeaders,
  initialScale = 1.5,
  tokenizer = new RegExp(/\w+([,.\-/]\w+)+|\w+|\W/g),
  disableOCR = true,
  entity,
  initialTextMap,
  defaultAnnotations = [],
  getAnnotations,
  getTextMaps,
}: Props, ref?: Ref<any>) => {
  const [scale, setScale] = useState(initialScale);

  const { pages, error, fetchPage } = usePDF({ url, data, httpHeaders });

  const {
    annotations,
    setAnnotations,
    getAnnotationsForPage,
    addAnnotation,
    removeAnnotation: deleteAnnotation
  } = useAnnotations(defaultAnnotations);

  const { textMap, addPageToTextMap } = useTextMap(annotations);

  useImperativeHandle(ref, () => ({ removeAnnotation }));
  const removeAnnotation = (id) => {
    deleteAnnotation(id);
  };

  useEffect(() => {
    setAnnotations(defaultAnnotations)
  }, [defaultAnnotations])

  useEffect(() => {
    if (getAnnotations) {
      getAnnotations(annotations);
    }
    if (getTextMaps) {
      getTextMaps(initialTextMap || textMap);
    }
  }, [annotations, textMap, initialTextMap, getAnnotations, getTextMaps]);

  const getTextLayerForPage = useCallback((page: number): Array<TextLayerItem> | undefined => {
    if (initialTextMap) {
      const found = initialTextMap.find((layer) => layer.page === page);
      return found ? found.textMapItems : undefined;
    }
    return undefined;
  }, [initialTextMap]);

  const renderPages = useMemo(() => {
    console.log('-- Render pages')
    if (!url && !data) {
      return (
        <Error
          message="You need to provide either valid PDF data or a URL to a PDF"
        />
      );
    }

    if (error) {
      return <Error />;
    }

    return (
      Array(pages).fill(0).map((_, index) => {
        const key = `pdf-page-${index}`;
        const pageNumber = index + 1;
        const page = fetchPage(pageNumber);
        return (
          <Page
            page={page}
            scale={scale}
            key={key}
            tokenizer={tokenizer}
            disableOCR={disableOCR}
            pageNumber={pageNumber}
            annotations={getAnnotationsForPage(pageNumber)}
            addAnnotation={addAnnotation}
            removeAnnotation={deleteAnnotation}
            addPageToTextMap={addPageToTextMap}
            entity={entity}
            initialTextLayer={getTextLayerForPage(pageNumber)}
          />
        );
      })
    );
  }, [
    url, data, pages, error, scale, tokenizer, disableOCR, entity,
    fetchPage, getAnnotationsForPage, addAnnotation, deleteAnnotation, addPageToTextMap, getTextLayerForPage,
  ]);

  return (
    <div className="annotator-container">
      <div className="annotator-pages-container">
        <div className="annotator-pages">
          { renderPages }
        </div>
      </div>
      <ButtonGroup scale={scale} setScale={setScale} />
    </div>
  );
});

export default Annotator;
