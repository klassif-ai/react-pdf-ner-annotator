import React, { FC } from 'react';
import Column from './Column';

interface Props {
	columns: Array<number>;
	height: number;
}

const Columns: FC<Props> = ({ columns, height }) => {
	return (
		<>
			{columns.map((column) => (
				<Column left={column} height={height - 4} />
			))}
		</>
	);
};

export default Columns;
