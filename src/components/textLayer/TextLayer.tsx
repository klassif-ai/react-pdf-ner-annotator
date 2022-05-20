import React, { memo, useContext } from 'react';
import deburr from 'lodash/deburr';
import hash from 'object-hash';
import { TextLayerItem } from '../../interfaces/textLayer';
import TokenContainer from './TokenContainer';
import AnnotationContext from '../../context/annotationContext';

interface Props {
  inView: boolean;
  canvasInitialized: boolean;
  textLayer: Array<TextLayerItem>|null;
  removeAnnotation: (id: number) => void;
}

const TextLayer = ({ inView, canvasInitialized, textLayer, removeAnnotation }: Props) => {
  const { tokenizer } = useContext(AnnotationContext);

  if (inView && canvasInitialized && textLayer?.length) {
    let offset = 0;
    return (
      <>
        {
          textLayer.map((textLayerItem) => {
            if (!textLayerItem.text) {
              return null;
            }

            const tokens = deburr(textLayerItem.text).match(tokenizer);
            const filteredTokenLength = tokens.filter((t) => t !== ' ').length;
            offset += filteredTokenLength;
            return (
              <TokenContainer
                key={hash(textLayerItem)}
                textLayerItem={textLayerItem}
                tokens={tokens}
                offset={offset - filteredTokenLength}
                removeAnnotation={removeAnnotation}
              />
            );
          })
        }
      </>
    );
  }

  return null;
};

export default memo(TextLayer);
