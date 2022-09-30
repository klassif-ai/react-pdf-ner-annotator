type EntityType = 'NER' | 'AREA';

export interface Entity {
	id: number;
	name: string;
	color: string;
	entityType: EntityType;
	regex?: RegExp;
	index?: number;
}

export interface IEntityHover {
	id: number;
	index?: number;
}
