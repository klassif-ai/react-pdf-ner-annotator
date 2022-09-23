import React, { FC } from 'react';

interface Props {
	left: number;
	height: number;
}

const Column: FC<Props> = ({ left, height }) => {
	return <div className="table-builder__column" style={{ left, height }}></div>;
};

export default Column;
