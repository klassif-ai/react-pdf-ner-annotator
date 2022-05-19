import { useState, useCallback, useEffect } from 'react';
import hash from 'object-hash';
import { Annotation, AnnotationParams } from '../interfaces/annotation';

const useAnnotations = (defaultAnnotations: Array<Annotation>, readonly: boolean) => {
  const [annotations, setAnnotations] = useState<Array<Annotation>>(defaultAnnotations);

  useEffect(() => {
    setAnnotations(defaultAnnotations);
  }, [defaultAnnotations]);

  const getAnnotationsForPage = useCallback((page: number): Array<Annotation> => {
    return annotations.filter((annotation: Annotation) => annotation.page === page);
  }, [annotations]);

  const addAnnotation = useCallback((annotation: AnnotationParams) => {
    if (readonly) {
      return;
    }

    const lastId = annotations[annotations.length - 1]?.id || 0;
    const newAnnotation: Annotation = {
      id: lastId + 1,
      hash: hash({
        annotation,
        dateTime: new Date().toLocaleString(),
      }),
      ...annotation,
    };
    const newAnnotations = [...annotations, newAnnotation];
    setAnnotations(newAnnotations);
  }, [annotations, readonly]);

  const updateAnnotation = useCallback((annotation: Annotation) => {
    if (readonly) {
      return;
    }

    const indexToUpdate = annotations.findIndex(x => x.id === annotation.id);
    if (indexToUpdate !== -1) {
      const updatedAnnotations = [...annotations];
      updatedAnnotations[indexToUpdate] = annotation;
      setAnnotations(updatedAnnotations);
    }
  }, [annotations, readonly]);

  const updateLastAnnotationForEntity = useCallback((annotation: AnnotationParams) => {
    if (readonly) {
      return;
    }

    const lastAnnotationForEntity = annotations
      .slice()
      .reverse()
      .find((x) => x.entity.id === annotation.entity.id && x.index === annotation.index);

    if (lastAnnotationForEntity) {
      const updatedAnnotations = [...annotations]
        .map((x) => {
          if (x.id === lastAnnotationForEntity.id) {
            return {
              ...x,
              nerAnnotation: {
                ...x.nerAnnotation,
                tokens: [...x.nerAnnotation.tokens, ...annotation.nerAnnotation.tokens],
                textIds: [...x.nerAnnotation.textIds, ...annotation.nerAnnotation.textIds],
              }
            };
          }
          return x;
        });
      setAnnotations(updatedAnnotations);
    } else {
      addAnnotation(annotation);
    }
  }, [addAnnotation, annotations, readonly]);

  const removeAnnotation = useCallback((id: number) => {
    if (readonly) {
      return;
    }

    const index = annotations.findIndex(a => a.id === id);
    if (index !== -1) {
      setAnnotations(annotations.filter((_, i) => i !== index));
    }
  }, [annotations, readonly]);

  return {
    annotations,
    getAnnotationsForPage,
    addAnnotation,
    updateAnnotation,
    updateLastAnnotationForEntity,
    removeAnnotation,
  };
};

export default useAnnotations;
