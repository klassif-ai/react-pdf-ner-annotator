import React, { useRef, useEffect } from 'react';
import useMouse from '@react-hook/mouse-position';
import Table from './Table';

interface Props {}

const TableBuilder = () => {
	return (
		<div className="table-builder__container">
			<Table
				tableData={{
					top: 520,
					left: 60,
					width: 765,
					height: 35,
					rows: [100],
					columns: [75, 415, 530],
				}}
			/>
		</div>
	);
};

export default TableBuilder;
