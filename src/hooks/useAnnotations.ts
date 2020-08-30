import { useState, useCallback } from 'react';
import { Annotation, AnnotationParams } from '../interfaces/annotation';
import { generateRandomId } from '../helpers/generalHelpers';

const useAnnotations = (defaultAnnotations: Array<Annotation>) => {
  const [annotations, setAnnotations] = useState<Array<Annotation>>(defaultAnnotations);

  const getAnnotationsForPage = useCallback((page: number): Array<Annotation> => {
    return annotations.filter((annotation: Annotation) => annotation.page === page);
  }, [annotations]);

  const addAnnotation = useCallback((annotation: AnnotationParams) => {
    const newAnnotation: Annotation = {
      id: generateRandomId(10),
      ...annotation
    };
    const newAnnotations = [...annotations, newAnnotation];
    setAnnotations(newAnnotations);
  }, [annotations]);

  const removeAnnotation = useCallback((id: string) => {
    const index = annotations.findIndex(a => a.id === id);
    if (index !== -1) {
      setAnnotations(annotations.filter((_, i) => i !== index));
    }
  }, [annotations]);

  return { annotations, getAnnotationsForPage, addAnnotation, removeAnnotation };
};

export default useAnnotations;
