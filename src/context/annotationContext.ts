import { createContext } from 'react';
import { Annotation } from '../interfaces/annotation';

interface AnnotationContextProps {
  annotations: Array<Annotation>;
  removeAnnotation: (id: number) => void;
  updateAnnotation: (annotation: Annotation) => void;
  tokenizer: RegExp;
}

const AnnotationContext = createContext<AnnotationContextProps>({
  annotations: [],
  removeAnnotation: () => {},
  updateAnnotation: () => {},
  tokenizer: new RegExp(/\w+([,.\-/]\w+)+|\w+|\W/g),
});

AnnotationContext.displayName = 'AnnotationContext';
export default AnnotationContext;
