import React, { memo, useContext, useMemo } from 'react';
import { Annotation } from '../../interfaces/annotation';
import AnnotationContext from '../../context/annotationContext';

interface Props {
	token: string;
	annotation: Annotation;
}

const Mark = ({ token, annotation }: Props) => {
	const { removeAnnotation, hoveredEntities } = useContext(AnnotationContext);

	const style = useMemo(() => {
		if (!hoveredEntities?.length) {
			return {
				backgroundColor: annotation.entity.color,
			}
		}

		if (hoveredEntities.some((hoveredEntity) => hoveredEntity.id === annotation.entity.id && hoveredEntity.index === annotation.index)) {
			return {
				backgroundColor: annotation.entity.color,
			}
		}

		return {
			backgroundColor: "#d3d3d3",
		}
	}, [hoveredEntities]);

	return (
		<mark
			className="mark-container"
			onClick={() => removeAnnotation(annotation.id)}
			style={style}
		>
			<span className="mark__token">{token}</span>
		</mark>
	);
};

export default memo(Mark);
