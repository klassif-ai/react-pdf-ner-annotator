import React, { useState } from 'react';
import { Annotation } from '../../interfaces/annotation';

interface Props {
  showInput: boolean;
  annotation: Annotation;
  updateAnnotation: (annotation: Annotation) => void;
}

const AreaTextAnnotation = ({ showInput, annotation, updateAnnotation }: Props) => {
  const [value, setValue] = useState(annotation.areaAnnotation.text || '');


  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleBlur = () => {
    updateAnnotation({
      ...annotation,
      areaAnnotation: {
        ...annotation.areaAnnotation,
        text: value,
      }
    });
  };



  return (
    <input
      className={`area-annotation__text-input ${showInput ? '' : 'hidden'}`.trim()}
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default AreaTextAnnotation;
