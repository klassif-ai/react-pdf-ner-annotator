import React from 'react';
import hash from 'object-hash';
import { TextLayerItem } from '../../interfaces/textLayer';
import TokenContainer from './TokenContainer';
import { Annotation } from '../../interfaces/annotation';
import { tokenizeText } from '../../helpers/textMapHelpers';

interface Props {
  inView: boolean;
  canvasInitialized: boolean;
  isAnnotating: boolean;
  textLayer: Array<TextLayerItem>|null;
  tokenizer: RegExp;
  needsTokenization: boolean;
  annotations: Array<Annotation>;
  removeAnnotation: (id: number) => void;
}

const TextLayer = ({ inView, canvasInitialized, isAnnotating, textLayer, tokenizer, needsTokenization, annotations, removeAnnotation }: Props) => {
  if (inView && canvasInitialized && textLayer?.length) {
    let offset = 0;
    return (
      <>
        {
          textLayer.map((textLayerItem) => {
            if (!textLayerItem.text) {
              return null;
            }

            const tokens = tokenizeText(textLayerItem.text, tokenizer, needsTokenization);
            const filteredTokenLength = tokens.filter((t) => t !== ' ').length;
            offset += filteredTokenLength;
            return (
              <TokenContainer
                key={hash(textLayerItem)}
                isAnnotating={isAnnotating}
                textLayerItem={textLayerItem}
                tokens={tokens}
                offset={offset - filteredTokenLength}
                annotations={annotations}
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

export default TextLayer;
