import React from 'react';
import AreaMark from './AreaMark';
import { Annotation } from '../../interfaces/annotation';

interface Props {
  pdfScale: number;
  annotations: Array<Annotation>;
  removeAnnotation: (id: number) => void;
  updateAnnotation: (annotation: Annotation) => void;
}

const AreaLayer = ({ pdfScale, annotations, removeAnnotation, updateAnnotation }: Props) => {
  return (
    <>
      {
        annotations.map((annotation) => (
          <AreaMark
            pdfScale={pdfScale}
            key={annotation.id}
            annotation={annotation}
            removeAnnotation={removeAnnotation}
            updateAnnotation={updateAnnotation}
          />
        ))
      }
    </>
  );
};

export default AreaLayer;
