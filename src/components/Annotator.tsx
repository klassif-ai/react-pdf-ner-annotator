import React, { useMemo } from 'react';
import usePDF from '../hooks/usePDF';
import useAnnotations from '../hooks/useAnnotations';
import Page from './page/Page';
import Error from './error/Error';
import './Annotator.scss';
import { Entity } from '../interfaces/entity';
import { Annotation } from '../interfaces/annotation';

interface Props {
  url?: string;
  data?: Uint8Array | BufferSource | string;
  httpHeaders?: {
    [key: string]: string;
  };
  scale?: number;
  regex?: RegExp;
  entity?: Entity;
  defaultAnnotations?: Array<Annotation>,
}

const Annotator = ({
  url,
  data,
  httpHeaders,
  scale = 1.5,
  regex = new RegExp(/\w+([,.\-/]\w+)+|\w+|\W/g),
  entity,
  defaultAnnotations = [],
}: Props) => {
  const { pages, error, fetchPage } = usePDF({ url, data, httpHeaders });
  const {
    annotations,
    getAnnotationsForPage,
    addAnnotation,
    removeAnnotation
  } = useAnnotations({ defaultAnnotations });

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
            regex={regex}
            pageNumber={pageNumber}
            annotations={getAnnotationsForPage(pageNumber)}
            addAnnotation={addAnnotation}
            removeAnnotation={removeAnnotation}
            entity={entity}
          />
        );
      })
    );
  }, [url, data, pages, error, scale, regex, entity, fetchPage, getAnnotationsForPage, addAnnotation, removeAnnotation]);

  return (
    <div className="annotator-container">
      { renderPages }
    </div>
  );
};

export default Annotator;
