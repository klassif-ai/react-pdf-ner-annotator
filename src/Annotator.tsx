import React, {
  memo,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  Ref, useRef,
} from 'react';
import hash from 'object-hash';
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
import { Config } from './interfaces/config';
import AnnotationContext from './context/annotationContext';
import ConfigContext from './context/configContext';
import EntityContext from './context/entityContext';

interface Props {
  config?: Config;
  url?: string;
  data?: Uint8Array | BufferSource | string;
  initialScale?: number;
  tokenizer?: RegExp;
  entity?: Entity;
  initialTextMap?: Array<TextLayer>;
  defaultAnnotations?: Array<Annotation>,
  getAnnotations(annotations: Array<Annotation>): void
  getTextMaps?(textMaps: Array<TextLayer>): void;
}

const Annotator = forwardRef(({
  config = {},
  url,
  data,
  initialScale = 1.5,
  tokenizer = new RegExp(/\w+([,.\-/]\w+)+|\w+|\W/g),
  entity,
  initialTextMap,
  defaultAnnotations = [],
  getAnnotations,
  getTextMaps,
}: Props, ref?: Ref<any>) => {
  const lastAnnotationsHash = useRef('');
  const [scale, setScale] = useState(initialScale);

  const { pages, error, fetchPage } = usePDF({ url, data, httpHeaders: config.httpHeaders });
  const {
    annotations,
    getAnnotationsForPage,
    addAnnotation,
    updateAnnotation,
    updateLastAnnotationForEntity,
    removeAnnotation: deleteAnnotation
  } = useAnnotations(defaultAnnotations, config.readonly);
  const { textMap, addPageToTextMap } = useTextMap(annotations);

  useImperativeHandle(ref, () => ({ removeAnnotation }));

  const removeAnnotation = (id: number) => {
    deleteAnnotation(id);
  };

  useEffect(() => {
    if (hash(annotations) === lastAnnotationsHash.current) {
      return;
    }

    if (getAnnotations) {
      getAnnotations(annotations);
      lastAnnotationsHash.current = hash(annotations);
    }
  }, [annotations, getAnnotations]);

  useEffect(() => {
    if (getTextMaps) {
      getTextMaps(initialTextMap || textMap);
    }
  }, [textMap, initialTextMap, getTextMaps]);

  const style = useMemo(() => {
    if (config.hideAnnotatingEntityVisualizations) {
      return {};
    }

    if (entity) {
      return {
        border: `5px solid ${entity.color}`
      };
    }
    return {};
  }, [entity, config]);

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
    <ConfigContext.Provider value={{ config }}>
      <div className="annotator-container" style={style}>
        <EntityVisualisation entity={entity} />
        <div className="annotator-pages-container">
          <EntityContext.Provider value={{ entity }}>
            <AnnotationContext.Provider value={{ annotations, tokenizer }}>
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
                      pageNumber={pageNumber}
                      annotations={getAnnotationsForPage(pageNumber)}
                      addAnnotation={addAnnotation}
                      updateLastAnnotationForEntity={updateLastAnnotationForEntity}
                      removeAnnotation={deleteAnnotation}
                      addPageToTextMap={addPageToTextMap}
                      initialTextLayer={getTextLayerForPage(pageNumber)}
                      updateAnnotation={updateAnnotation}
                    />
                  );
                })}
              </div>
            </AnnotationContext.Provider>
          </EntityContext.Provider>
        </div>
        <ButtonGroup scale={scale} setScale={setScale} />
      </div>
    </ConfigContext.Provider>
  );
});

export default memo(Annotator);

