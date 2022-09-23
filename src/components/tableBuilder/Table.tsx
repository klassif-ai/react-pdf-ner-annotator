import React, { FC, useMemo } from 'react';
import { TableData } from './interfaces';
import Columns from './column/Columns';
import TableBorder from './table/TableBorder';

interface Props {
	tableData: TableData;
}

const Table: FC<Props> = ({ tableData }) => {
	const style = useMemo(() => {
		return {
			width: `${tableData.width}px`,
			height: `${tableData.height}px`,
			top: tableData.top,
			left: tableData.left,
		};
	}, [tableData]);

	return (
		<>
			<TableBorder type="top" style={{ ...style, height: 0, padding: '10px 0', borderTop: '5px solid grey' }} />
			<TableBorder type="left" style={{ ...style, width: 0, padding: '0 10px', borderLeft: '5px solid grey' }} />
			<div style={style} className="table-builder__table">
				<Columns columns={tableData.columns} height={tableData.height} />
			</div>
		</>
	);
};

export default Table;
