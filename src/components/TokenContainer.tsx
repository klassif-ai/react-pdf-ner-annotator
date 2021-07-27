import React, { useMemo } from 'react';
import { TextLayerItem } from '../interfaces/textLayer';
import { getTextMetrics } from '../helpers/textMapHelpers';
import Token from './Token';
import { Annotation } from '../interfaces/annotation';
import Mark from './Mark';
import { isBetween } from '../helpers/generalHelpers';

interface Props {
  isAnnotating: boolean;
  textLayerItem: TextLayerItem;
  tokens: Array<string>;
  offset: number;
  annotations: Array<Annotation>;
  removeAnnotation: (id: number) => void;
}

const TokenContainer = ({ isAnnotating, textLayerItem, tokens, offset, annotations, removeAnnotation }: Props) => {
  let index = 0;
  let spaceAsMark = false;
  const { text, coords } = textLayerItem;

  const metrics = useMemo(() => getTextMetrics(text), [text]);
  const scale = useMemo(() => ({
    'x': coords.width/metrics.width,
    'y': coords.height/metrics.height
  }), [metrics, coords]);

  const style = useMemo(() => {
    const { coords, fontSize, transform, fontFamily } = textLayerItem;

    if (fontSize && transform && fontFamily) {
      return {
        left: `${coords.left}px`,
        top: `${coords.top}px`,
        fontSize: `${fontSize}px`,
        fontFamily: `${fontFamily}`,
        transform: `scaleX(${transform})`,
      };
    }

    return {
      left: `${coords.left}px`,
      top: `${coords.top}px`,
      width: `${coords.width}px`,
      height: `${coords.height}px`,
      font: '12px sans-serif',
      transform: `scale(${scale.x}, ${scale.y})`,
    };
  }, [textLayerItem, metrics, scale]);

  return (
    <span
      className="token-container"
      style={style}
    >
      {
        tokens.map((token, keyIndex) => {
          const dataI = textLayerItem.dataI || (offset + index + 1);
          const annotation = annotations.find((a) => a.textIds.includes(dataI));
          const tokenIndexIsNotFirstOrLast = isBetween(keyIndex, 0, tokens.length - 1);

          if (token === ' ') {
            if (annotation && spaceAsMark && tokenIndexIsNotFirstOrLast) {
              spaceAsMark = false;
              return (
                <Mark key={keyIndex} token={token} annotation={annotation} removeAnnotation={removeAnnotation} />
              );
            }
            return (
              <Token
                key={keyIndex}
                isAnnotating={isAnnotating}
                token={token}
              />
            );
          }

          index += 1;

          if (annotation) {
            spaceAsMark = true;
            return (
              <Mark key={keyIndex} token={token} annotation={annotation} removeAnnotation={removeAnnotation} />
            );
          }

          return (
            <Token
              key={keyIndex}
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
