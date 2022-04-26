import React from 'react';
import { Entity } from '../interfaces/entity';

type Props = {
  hidden?: boolean;
  entity?: Entity;
};

const EntityVisualisation = ({ hidden, entity }: Props) => {
  if (!entity || hidden) {
    return null;
  }

  return (
    <span className="active-entity" style={{ backgroundColor: entity.color }}>
      {entity.name}
    </span>
  );
};

export default EntityVisualisation;
