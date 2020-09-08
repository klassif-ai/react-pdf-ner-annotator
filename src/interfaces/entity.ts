export type EntityType = 'NER';

export interface Entity {
  id: number;
  name: string;
  color: string;
  entityType: EntityType;
  regex?: RegExp;
}
