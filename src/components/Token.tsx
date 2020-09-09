import React  from 'react';

interface Props {
  token: string;
  dataI?: number;
}

const Token = ({ token, dataI }: Props) => {
  const renderToken = () => {
    if (dataI) {
      return (
        <span
          data-i={dataI}
          className="token__text-item"
        >
          {token}
        </span>
      );
    }
    return <span className="token__text-item">{token}</span>;
  };

  return renderToken();
};

export default Token;
