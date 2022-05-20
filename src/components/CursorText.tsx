import React, { FC, useContext, useMemo, useRef } from 'react';
import { Entity } from '../interfaces/entity';
import { Point } from '../interfaces/point';
import ConfigContext from '../context/configContext';

interface Props {
  mouseCoords: Point;
  entity?: Entity;
}

const OFFSET = 15;

const CursorText: FC<Props> = ({ entity, mouseCoords }) => {
  const { config } = useContext(ConfigContext);

  const ref = useRef(null);

  const style = useMemo(() => {
    if (!entity || config.hideAnnotatingTooltips || !ref.current) {
      return {};
    }

    return {
      left: `${mouseCoords.x + OFFSET}px`,
      top: `${mouseCoords.y + OFFSET}px`,
      backgroundColor: entity.color,
    };
  }, [entity, config.hideAnnotatingTooltips, mouseCoords]);

  if (!entity || config.hideAnnotatingTooltips) {
    return null;
  }

  return <span className="cursor-text" ref={ref} style={style}>{entity.name}</span>;
};

export default CursorText;
