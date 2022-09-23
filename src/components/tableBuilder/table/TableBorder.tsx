import React, { FC, useState, useRef } from 'react';
import useMouse from '@react-hook/mouse-position';

interface Props {
	type: 'top' | 'left';
	style: any;
}

const TableBorder: FC<Props> = ({ type, style }) => {
	const [isHovered, setIsHovered] = useState(false);

	const ref = useRef(null);
	const mouse = useMouse(ref);

	console.log(mouse);

	return (
		<>
			<i
				className="bi-node-plus table-builder__border"
				style={{ visibility: isHovered ? 'visible' : 'hidden', top: style.top - 20, left: mouse.x}}
			/>
			<div
				ref={ref}
				className="table-builder__border"
				style={{ ...style }}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			/>
		</>
	);
};

export default TableBorder;
