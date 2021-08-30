import React  from 'react';

interface Props {
  isAnnotating: boolean;
  token: string;
  dataI?: number;
}

const Token = ({ isAnnotating, token, dataI }: Props) => {
  if (dataI) {
    return (
      <span
        data-i={dataI}
        className={`token__text-item ${isAnnotating ? 'annotatable' : ''}`.trim()}
      >
        {token}
      </span>
    );
  }

  return <span className="token__text-item">{token}</span>;
};

export default Token;
