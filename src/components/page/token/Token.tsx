import React from 'react';
import './Token.scss';

interface Props {
  left: number;
  top: number;
  fontSize: number;
  fontFamily: string;
  transform: number;
  tokens: Array<string>;
}

const Token = ({
  left,
  top,
  fontSize,
  fontFamily,
  transform,
  tokens,
}: Props) => {
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
      {
        tokens.map((token) => (
          <span className="token__text-item" key={`${left}-${top}-${token}`}>{token}</span>
        ))
      }
    </span>
  );
};

export default Token;
