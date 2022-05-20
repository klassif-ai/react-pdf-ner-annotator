import React, { memo } from 'react';
import { Annotation } from '../../interfaces/annotation';



interface Props {
  token: string;
  annotation: Annotation;
  removeAnnotation: (id: number) => void;
}

const Mark = ({ token, annotation, removeAnnotation }: Props)  => {
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
