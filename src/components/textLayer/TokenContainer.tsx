import React, { useMemo, memo, useContext } from 'react';
import { TextLayerItem } from '../../interfaces/textLayer';
import { getTextMetrics } from '../../helpers/textMapHelpers';
import Token from './Token';
import Mark from './Mark';
import { isBetween } from '../../helpers/generalHelpers';
import AnnotationContext from '../../context/annotationContext';

interface Props {
	textLayerItem: TextLayerItem;
	tokens: Array<string>;
	offset: number;
	pageNumber: number;
}

const TokenContainer = ({ textLayerItem, tokens, offset, pageNumber }: Props) => {
	let index = 0;
	let spaceAsMark = false;
	const { text, coords, fontSize, transform, fontFamily } = textLayerItem;

	const context = useContext(AnnotationContext);

	const annotations = useMemo(() => {
		return context.annotations.filter((annotation) => !!annotation.nerAnnotation && annotation.page === pageNumber);
	}, [context, pageNumber]);

	const metrics = useMemo(() => getTextMetrics(text), [text]);
	const scale = useMemo(
		() => ({
			x: coords.width / metrics.width,
			y: coords.height / metrics.height,
		}),
		[metrics, coords],
	);

	const style = useMemo(() => {
		if (fontSize && transform && fontFamily) {
			return {
				left: `${coords.left}px`,
				top: `${coords.top}px`,
				fontSize: `${fontSize}px`,
				fontFamily: `${fontFamily}`,
				transform: `scaleX(${transform})`,
			};
		}

		return {
			left: `${coords.left}px`,
			top: `${coords.top}px`,
			width: `${coords.width}px`,
			height: `${coords.height}px`,
			font: '12px sans-serif',
			transform: `scale(${scale.x}, ${scale.y})`,
		};
	}, [fontSize, transform, fontFamily, coords.left, coords.top, coords.width, coords.height, scale.x, scale.y]);

	return (
		<span className="token-container" style={style}>
			{tokens.map((token, keyIndex) => {
				const dataI = textLayerItem.dataI || offset + index + 1;
				const annotation = annotations.find((a) => a.nerAnnotation.textIds.includes(dataI));
				const tokenIndexIsNotFirstOrLast = isBetween(keyIndex, 0, tokens.length - 1);

				if (token === ' ') {
					if (annotation && spaceAsMark && tokenIndexIsNotFirstOrLast) {
						spaceAsMark = false;
						return <Mark key={keyIndex} token={token} annotation={annotation} />;
					}
					return <Token key={keyIndex} token={token} />;
				}

				index += 1;

				if (annotation) {
					spaceAsMark = true;
					return <Mark key={keyIndex} token={token} annotation={annotation} />;
				}

				return <Token key={keyIndex} token={token} dataI={dataI} />;
			})}
		</span>
	);
};

export default memo(TokenContainer);
