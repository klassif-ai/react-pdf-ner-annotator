import React from 'react';
import { Annotation } from '../../../interfaces/annotation';
import './Mark.scss';



interface Props {
  dataI: number;
  token: string;
  annotation: Annotation;
  removeAnnotation: (id: string) => void;
}

const Mark = ({ dataI, token, annotation, removeAnnotation }: Props)  => {
  const isFirst = dataI === annotation.textIds[0];

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

export default Mark;
