import React, { useMemo, useState } from 'react';
import { Annotation } from '../../interfaces/annotation';
import AreaTextAnnotation from './AreaTextAnnotation';
import { recalculateBoundingBox } from '../../helpers/pdfHelpers';
import AreaAnnotationToggle from './AreaAnnotationToggle';

interface Props {
  pdfScale: number;
  annotation: Annotation;
  removeAnnotation: (id: number) => void;
  updateAnnotation: (annotation: Annotation) => void;
}

const AreaMark = ({ pdfScale, annotation, removeAnnotation, updateAnnotation }: Props) => {
  const [showInput, setShowInput] = useState(true);

  const { areaAnnotation: { boundingBox: bb, pdfInformation: { scale } } } = annotation;

  const boundingBox = useMemo(() => recalculateBoundingBox(bb, scale, pdfScale), [bb, scale, pdfScale]);

  return (
    <div
      className='area-annotation__container'
      style={{
        left: `${boundingBox.left}px`,
        top: `${boundingBox.top - 35}px`,
        width: `${boundingBox.width}px`,
        height: `${boundingBox.height + 35}px`,
      }}
    >
      <AreaTextAnnotation
        showInput={showInput}
        annotation={annotation}
        updateAnnotation={updateAnnotation}
      />
      <div
        role="button"
        aria-label="Area annotation"
        onClick={() => removeAnnotation(annotation.id)}
        className='area-annotation__mark'
        style={{
          width: `${boundingBox.width}px`,
          height: `${boundingBox.height}px`,
          border: `2px solid ${annotation.entity.color}`
        }}
      >
        <AreaAnnotationToggle showInput={showInput} setShowInput={setShowInput} />
        <span
          style={{ backgroundColor: annotation.entity.color }}
        />
      </div>
    </div>
  );
};

export default AreaMark;
