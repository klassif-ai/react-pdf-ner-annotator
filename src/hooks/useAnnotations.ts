import { useState, useCallback, useEffect } from 'react';
import hash from 'object-hash';
import { Annotation, AnnotationParams } from '../interfaces/annotation';
import { generateRandomHash } from '../helpers/hashHelper';

const useAnnotations = (defaultAnnotations: Array<Annotation>, readonly: boolean, shouldUpdateDefaultAnnotations: boolean) => {
  const [annotations, setAnnotations] = useState<Array<Annotation>>([]);
  const [lastActionHash, setLastActionHash] = useState<string>('');

  useEffect(() => {
    if (shouldUpdateDefaultAnnotations) {
      setAnnotations(defaultAnnotations);
    }
  }, [hash(defaultAnnotations), shouldUpdateDefaultAnnotations]);

  const getAnnotationsForPage = useCallback((page: number): Array<Annotation> => {
    return annotations.filter((annotation: Annotation) => annotation.page === page);
  }, [annotations]);

  const addAnnotation = useCallback((annotation: AnnotationParams) => {
    if (readonly) {
      return;
    }

    setAnnotations((prevAnnotations) => {
      const lastId = prevAnnotations[prevAnnotations.length - 1]?.id || 0;
      const newAnnotation: Annotation = {
        id: lastId + 1,
        ...annotation,
      };
      return [...prevAnnotations, newAnnotation];
    });
    setLastActionHash(generateRandomHash());
  }, [readonly]);

  const updateAnnotation = useCallback((annotation: Annotation) => {
    if (readonly) {
      return;
    }

    setAnnotations((prevAnnotations) => prevAnnotations.map((prevAnnotation) => {
      if (prevAnnotation.id === annotation.id) {
        return annotation;
      }
      return prevAnnotation;
    }));
    setLastActionHash(generateRandomHash());
  }, [readonly]);

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
    setLastActionHash(generateRandomHash());
  }, [addAnnotation, annotations, readonly]);

  const removeAnnotation = useCallback((id: number) => {
    if (readonly) {
      return;
    }

    setAnnotations((prevAnnotations) => prevAnnotations.filter(a => a.id !== id));
    setLastActionHash(generateRandomHash());
  }, [readonly]);

  return {
    annotations,
    getAnnotationsForPage,
    addAnnotation,
    updateAnnotation,
    updateLastAnnotationForEntity,
    removeAnnotation,
    lastActionHash,
  };
};

export default useAnnotations;
