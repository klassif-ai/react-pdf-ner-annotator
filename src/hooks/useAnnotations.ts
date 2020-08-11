import { useState } from 'react';
import { Annotation, AnnotationParams } from '../interfaces/annotation';
import { generateRandomId } from '../helpers/generalHelpers';

interface Props {
  defaultAnnotations: Array<Annotation>;
}

const useAnnotations = ({ defaultAnnotations }: Props) => {
  const [annotations, setAnnotations] = useState<Array<Annotation>>(defaultAnnotations);

  const getAnnotationsForPage = (page: number): Array<Annotation> => {
    return annotations.filter((annotation: Annotation) => annotation.page === page);
  };

  const addAnnotation = (annotation: AnnotationParams) => {
    const newAnnotation: Annotation = {
      id: generateRandomId(10),
      ...annotation
    };
    const newAnnotations = [...annotations, newAnnotation];
    setAnnotations(newAnnotations);
  };

  const removeAnnotation = (id: string) => {
    const index = annotations.findIndex(a => a.id === id);
    if (index !== -1) {
      setAnnotations(annotations.filter((_, i) => i !== index));
    }
  };

  return { annotations, getAnnotationsForPage, addAnnotation, removeAnnotation };
};

export default useAnnotations;
