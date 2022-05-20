import { createContext } from 'react';
import { Annotation } from '../interfaces/annotation';

interface AnnotationContextProps {
  annotations: Array<Annotation>;
  tokenizer: RegExp;
}

const AnnotationContext = createContext<AnnotationContextProps>({
  annotations: [],
  tokenizer: new RegExp(/\w+([,.\-/]\w+)+|\w+|\W/g),
});

AnnotationContext.displayName = 'AnnotationContext';
export default AnnotationContext;
