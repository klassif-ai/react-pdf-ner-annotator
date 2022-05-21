import React, { memo, useContext } from 'react';
import { Annotation } from '../../interfaces/annotation';
import AnnotationContext from '../../context/annotationContext';



interface Props {
  token: string;
  annotation: Annotation;
}

const Mark = ({ token, annotation }: Props)  => {
  const { removeAnnotation } = useContext(AnnotationContext);

  return (
    <mark
      className="mark-container"
      onClick={() => removeAnnotation(annotation.id)}
      style={{
        backgroundColor: annotation.entity.color,
      }}
    >
      <span className="mark__token">{ token }</span>
    </mark>
  );
};

export default memo(Mark);
