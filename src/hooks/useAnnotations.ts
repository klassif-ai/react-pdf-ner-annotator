import { useState } from 'react';
import { Annotation, AnnotationParams } from '../interfaces/annotation';

const generateRandomId = (): string => Math.random().toString(36).substring(10);

const useAnnotations = () => {
  const [annotations, setAnnotations] = useState<Array<Annotation>>([]);

  const getAnnotationsForPage = (page: number): Array<Annotation> => {
    return annotations.filter((annotation: Annotation) => annotation.page === page);
  };

  const addAnnotation = (annotation: AnnotationParams) => {
    const newAnnotation: Annotation = {
      id: generateRandomId(),
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
