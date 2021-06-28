import React, { useMemo } from 'react';
import deburr from 'lodash/deburr';
import { TextLayerItem } from '../interfaces/textLayer';
import { getTextMetrics } from '../helpers/textMapHelpers';
import Token from './Token';
import { generateRandomId } from '../helpers/generalHelpers';
import { Annotation } from '../interfaces/annotation';
import Mark from './Mark';

interface Props {
  isAnnotating: boolean;
  textLayerItem: TextLayerItem;
  tokens: Array<string>;
  offset: number;
  annotations: Array<Annotation>;
  removeAnnotation: (id: string) => void;
}

const TokenContainer = ({ isAnnotating, textLayerItem, tokens, offset, annotations, removeAnnotation }: Props) => {
  let index = 0;
  // TODO determine whether to use just coords or more complex info
  const { text, coords, fontSize, transform, fontFamily } = textLayerItem;

  const metrics = useMemo(() => getTextMetrics(text), [text]);
  const scale = useMemo(() => ({
    'x': coords.width/metrics.width,
    'y': coords.height/metrics.height
  }), [metrics, coords]);

  return (
    <span
      className="token-container"
      style={{
        left: `${coords.left}px`,
        top: `${coords.top}px`,
        width: `${coords.width}px`,
        height: `${coords.height}px`,
        font: '12px sans-serif',
        transform: `scale(${scale.x}, ${scale.y})`,
      }}
    >
      {
        tokens.map((token) => {
          const dataI = textLayerItem.dataI || (offset + index + 1);
          const annotation = annotations.find((a) => a.textIds.includes(dataI));
          if (annotation) {
            return (
              <Mark token={token} annotation={annotation} removeAnnotation={removeAnnotation} />
            );
          }
          if (token === ' ') {
            return (
              <Token
                key={generateRandomId(7)}
                isAnnotating={isAnnotating}
                token={token}
              />
            );
          }

          index += 1;
          return (
            <Token
              key={generateRandomId(7)}
              isAnnotating={isAnnotating}
              token={token}
              dataI={dataI}
            />
          );
        })
      }
    </span>
  );
};

export default TokenContainer;
