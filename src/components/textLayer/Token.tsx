import React, { memo, useContext, useMemo } from 'react';
import EntityContext from '../../context/entityContext';

interface Props {
  token: string;
  dataI?: number;
}

const Token = ({ token, dataI }: Props) => {
  const { entity } = useContext(EntityContext);

  const isAnnotating = useMemo(() => entity?.entityType === 'NER', [entity]);

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

export default memo(Token);
