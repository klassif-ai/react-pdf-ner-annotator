import React from 'react';
import { Annotation } from '../../../interfaces/annotation';
import './Mark.scss';



interface Props {
  token: string;
  annotation: Annotation;
  removeAnnotation: (id: string) => void;
}

const Mark = ({ token, annotation, removeAnnotation }: Props)  => {
  return (
    <span
      className="mark-container"
      onClick={() => removeAnnotation(annotation.id)}
      role="button"
      style={{
        backgroundColor: annotation.entity.color,
      }}
    >
      { token }
    </span>
  );
};

export default Mark;
