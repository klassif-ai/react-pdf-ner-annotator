import React, { useMemo } from 'react';
import { Rectangle } from 'tesseract.js';

interface Props {
	isDragging: boolean;
	coordinates: Rectangle;
}

const SelectionRectangle = ({ isDragging, coordinates }: Props) => {
	const visibility = useMemo(() => (isDragging ? 'visible' : 'hidden'), [isDragging]);

	return (
		<span
			data-ignore={true}
			className="selection__rectangle"
			style={{
				visibility,
				left: `${coordinates.left}px`,
				top: `${coordinates.top}px`,
				width: `${coordinates.width}px`,
				height: `${coordinates.height}px`,
			}}
		/>
	);
};

export default SelectionRectangle;
