import { createContext } from 'react';
import { Entity } from '../interfaces/entity';

interface EntityContextProps {
  entity?: Entity;
}

const EntityContext = createContext<EntityContextProps>({
  entity: undefined,
});

EntityContext.displayName = 'EntityContext';
export default EntityContext;
