import { Entity } from './entity';

export interface Annotation extends AnnotationParams {
  id: string;
}

export interface AnnotationParams {
  entity: Entity;
  textIds: Array<number>;
  tokens: Array<string>;
  page: number;
}
