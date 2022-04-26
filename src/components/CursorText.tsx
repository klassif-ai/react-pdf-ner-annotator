import React, { FC, useMemo, useRef } from 'react';
import { Entity } from '../interfaces/entity';
import { Point } from '../interfaces/point';

interface Props {
  hidden: boolean;
  mouseCoords: Point;
  entity?: Entity;
}

const OFFSET = 15;

const CursorText: FC<Props> = ({ hidden, entity, mouseCoords }) => {
  const ref = useRef(null);

  const style = useMemo(() => {
    if (!entity || hidden || !ref.current) {
      return {};
    }

    return {
      left: `${mouseCoords.x + OFFSET}px`,
      top: `${mouseCoords.y + OFFSET}px`,
      backgroundColor: entity.color,
    };
  }, [entity, hidden, mouseCoords]);

  if (!entity || hidden) {
    return null;
  }

  return <span className="cursor-text" ref={ref} style={style}>{entity.name}</span>;
};

export default CursorText;
