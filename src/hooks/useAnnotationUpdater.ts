import { useEffect, useRef } from 'react';
import { Annotation } from '../interfaces/annotation';


const useAnnotationUpdater = (
  actionHash: string,
  annotations: Array<Annotation>,
  readonly: boolean,
  updateAnnotationsParent:(annotations: Array<Annotation>) => void
) => {
  const lastResolvedHash = useRef<string>('');

  useEffect(() => {
    if (readonly) {
      return;
    }

    if (!useAnnotationUpdater) {
      return;
    }

    if (actionHash === lastResolvedHash.current) {
      return;
    }

    lastResolvedHash.current = actionHash;
    updateAnnotationsParent(annotations);
  }, [actionHash, readonly, updateAnnotationsParent, annotations]);
};

export default useAnnotationUpdater;
