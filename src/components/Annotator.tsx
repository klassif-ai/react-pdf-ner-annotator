import React, { useMemo, useState, useEffect } from 'react';
import usePDF from '../hooks/usePDF';
import useAnnotations from '../hooks/useAnnotations';
import useTextMap from '../hooks/useTextMap';
import Page from './page/Page';
import Error from './error/Error';
import { Entity } from '../interfaces/entity';
import { Annotation } from '../interfaces/annotation';
import ButtonGroup from './fab/ButtonGroup';
import './Annotator.scss';
import { TextMap } from '../interfaces/textMap';

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
  initialTextMap?: Array<TextMap>;
  defaultAnnotations?: Array<Annotation>,
  getAnnotations?: (annotations: Array<Annotation>) => void;
  getTextMaps?: (textMaps: Array<TextMap>) => void;
}

const Annotator = ({
  url,
  data,
  httpHeaders,
  initialScale = 1.5,
  tokenizer = new RegExp(/\w+([,.\-/]\w+)+|\w+|\W/g),
  disableOCR = false,
  entity,
  initialTextMap,
  defaultAnnotations = [],
  getAnnotations,
  getTextMaps,
}: Props) => {
  const [scale, setScale] = useState(initialScale);

  const { pages, error, fetchPage } = usePDF({ url, data, httpHeaders });
  const {
    annotations,
    getAnnotationsForPage,
    addAnnotation,
    removeAnnotation
  } = useAnnotations({ defaultAnnotations });
  const { textMap, addPageToTextMap } = useTextMap(annotations);

  useEffect(() => {
    if (getAnnotations) {
      getAnnotations(annotations);
    }
    if (getTextMaps) {
      getTextMaps(initialTextMap || textMap);
    }
  }, [annotations, textMap, initialTextMap, getAnnotations, getTextMaps]);

  const renderPages = useMemo(() => {
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
            removeAnnotation={removeAnnotation}
            addTextMapPage={addPageToTextMap}
            entity={entity}
          />
        );
      })
    );
  }, [
    url, data, pages, error, scale, tokenizer, disableOCR, entity,
    fetchPage, getAnnotationsForPage, addAnnotation, removeAnnotation, addPageToTextMap
  ]);

  return (
    <div className="annotator-container">
      <div className="annotator-pages">
        { renderPages }
      </div>
    </div>
  );
};

export default Annotator;
