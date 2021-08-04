import React from 'react';
import { Entity } from '../interfaces/entity';

type Props = {
  entity?: Entity;
};

const EntityVisualisation = ({ entity }: Props) => {
  if (!entity) {
    return null;
  }

  return (
    <span className="active-entity" style={{ backgroundColor: entity.color }}>
      {entity.name}
    </span>
  );
};

export default EntityVisualisation;
