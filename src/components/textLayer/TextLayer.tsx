import React, { memo, useContext } from 'react';
import hash from 'object-hash';
import { TextLayerItem } from '../../interfaces/textLayer';
import TokenContainer from './TokenContainer';
import AnnotationContext from '../../context/annotationContext';
import { tokenizeText } from '../../helpers/textMapHelpers';

interface Props {
  inView: boolean;
  canvasInitialized: boolean;
  textLayer: Array<TextLayerItem>|null;
  needsTokenization: boolean;
  pageNumber: number;
}

const TextLayer = ({ inView, canvasInitialized, textLayer, needsTokenization, pageNumber }: Props) => {
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

            const tokens = tokenizeText(textLayerItem.text, tokenizer, needsTokenization);
            const filteredTokenLength = tokens.filter((t) => t !== ' ').length;
            offset += filteredTokenLength;
            return (
              <TokenContainer
                key={hash(textLayerItem)}
                textLayerItem={textLayerItem}
                tokens={tokens}
                offset={offset - filteredTokenLength}
                pageNumber={pageNumber}
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
