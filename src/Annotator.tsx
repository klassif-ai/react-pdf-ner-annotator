import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  Ref,
  memo
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
import EntityVisualisation from './components/EntityVisualisation';

interface Props {
  url?: string;
  data?: Uint8Array | BufferSource | string;
  httpHeaders?: {
    [key: string]: string;
  };
  initialScale?: number;
  tokenizer?: RegExp;
  disableOCR?: boolean;
  readonly?: boolean;
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
  disableOCR = false,
  readonly = false,
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
    getAnnotationsForPage,
    addAnnotation,
    updateAnnotation,
    removeAnnotation: deleteAnnotation
  } = useAnnotations(defaultAnnotations, readonly);
  const { textMap, addPageToTextMap } = useTextMap(annotations);

  useImperativeHandle(ref, () => ({ removeAnnotation }));

  const removeAnnotation = (id: number) => {
    deleteAnnotation(id);
  };

  useEffect(() => {
    if (getAnnotations) {
      getAnnotations(annotations);
    }
  }, [annotations, getAnnotations]);

  useEffect(() => {
    if (getTextMaps) {
      getTextMaps(initialTextMap || textMap);
    }
  }, [textMap, initialTextMap, getTextMaps]);

  const style = useMemo(() => {
    if (entity) {
      return {
        border: `5px solid ${entity.color}`
      };
    }
    return {};
  }, [entity]);

  const getTextLayerForPage = useCallback((page: number): Array<TextLayerItem> | undefined => {
    if (initialTextMap) {
      const found = initialTextMap.find((layer) => layer.page === page);
      return found ? found.textMapItems : undefined;
    }
    return undefined;
  }, [initialTextMap]);

  if (!url && !data) {
    return (
      <div className="annotator-container">
        <div className="annotator-pages-container">
          <div className="annotator-pages">
            <Error message="You need to provide either valid PDF data or a URL to a PDF" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="annotator-container">
        <div className="annotator-pages-container">
          <div className="annotator-pages">
            <Error />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="annotator-container" style={style}>
      <EntityVisualisation entity={entity} />
      <div className="annotator-pages-container">
        <div className="annotator-pages">
          {Array(pages).fill(0).map((_, index) => {
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
                updateAnnotation={updateAnnotation}
              />
            );
          })}
        </div>
      </div>
      <ButtonGroup scale={scale} setScale={setScale} />
    </div>
  );
});

export default memo(Annotator);

