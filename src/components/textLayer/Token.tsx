import React, { memo, useContext, useMemo } from 'react';
import EntityContext from '../../context/entityContext';
import ConfigContext from '../../context/configContext';

interface Props {
	token: string;
	dataI?: number;
}

const Token = ({ token, dataI }: Props) => {
	const { entity } = useContext(EntityContext);
	const { config } = useContext(ConfigContext);

	const annotateableBox = useMemo(() => {
		if (config.hideAnnotateableBoxes) {
			return false;
		}

		return entity?.entityType === 'NER';
	}, [entity, config]);

	if (dataI) {
		return (
			<span data-i={dataI} className={`token__text-item ${annotateableBox ? 'annotatable' : ''}`.trim()}>
				{token}
			</span>
		);
	}

	return <span className="token__text-item">{token}</span>;
};

export default memo(Token);
