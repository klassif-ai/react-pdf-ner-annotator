import React, { useMemo } from 'react';
import './Token.scss';
import { generateRandomId } from '../../../helpers/generalHelpers';

interface Props {
  left: number;
  top: number;
  fontSize: number;
  fontFamily: string;
  transform: number;
  tokens: Array<string>;
  lastIndex: number;
}

const Token = ({
  left,
  top,
  fontSize,
  fontFamily,
  transform,
  tokens,
  lastIndex,
}: Props) => {
  const renderTokens = useMemo(() => {
    let index = 0;


    return tokens.map((token) => {
      if (token !== ' ') {
        index+=1;
        return (
          <span
            data-i={lastIndex + index - 1}
            className="token__text-item"
            key={generateRandomId(7)}
          >
            {token}
          </span>
        );
      }
      return <span className="token__text-item" key={generateRandomId(7)}>{token}</span>;
    });
  }, [tokens, lastIndex]);

  return (
    <span
      className="token-container"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        fontSize: `${fontSize}px`,
        fontFamily: `${fontFamily}`,
        transform: `scaleX(${transform})`,
      }}
    >
      { renderTokens }
    </span>
  );
};

export default Token;
