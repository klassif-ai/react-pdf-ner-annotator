import React, { useContext } from 'react';
import { Entity } from '../interfaces/entity';
import ConfigContext from '../context/configContext';

type Props = {
  entity?: Entity;
};

const EntityVisualisation = ({ entity }: Props) => {
  const { config } = useContext(ConfigContext);

  if (!entity || config.hideAnnotatingEntityVisualizations) {
    return null;
  }

  return (
    <span className="active-entity" style={{ backgroundColor: entity.color }}>
      {entity.name}
    </span>
  );
};

export default EntityVisualisation;
