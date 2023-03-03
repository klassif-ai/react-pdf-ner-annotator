import { useState, useCallback, useEffect } from 'react';
import { PDFPageViewport, TextContent } from 'pdfjs-dist';
import lodash from 'lodash';
import { TextLayerItem } from '../interfaces/textLayer';
import {
	calculateFontSize,
	calculateTextProperties,
	calculateTransform,
	recalculateBoundingBox,
} from '../helpers/pdfHelpers';

const useTextLayer = (scale: number, context: CanvasRenderingContext2D, initialTextLayer?: Array<TextLayerItem>) => {
	const [textLayer, setTextLayer] = useState<Array<TextLayerItem> | null>(initialTextLayer || null);
	const [baseScale, setBaseScale] = useState(1.5);

	useEffect(() => {
		if (textLayer && context && baseScale !== scale) {
			const rescaledWords = textLayer.map((word) => {
				const coords = recalculateBoundingBox(word.coords, baseScale, scale);
				const fontSize = calculateFontSize(coords.width, coords.height, word.text);
				const transform = calculateTransform(coords.width, fontSize, word.fontFamily, word.text, context);
				return {
					...word,
					coords,
					fontSize,
					transform,
				};
			});

			setTextLayer(rescaledWords);
			setBaseScale(scale);
		}
	}, [scale, baseScale, textLayer, context]);

	const buildTextLayer = useCallback(
		(textContent: TextContent, viewport: PDFPageViewport) => {
			const textResult: Array<TextLayerItem> = textContent.items.map((item) => {
				const style = textContent.styles[item.fontName];
				const { left, top, fontSize, transform } = calculateTextProperties(item, style, viewport, context);

				return {
					coords: {
						left,
						top,
						width: item.width * scale,
						height: item.height * scale,
					},
					text: item.str,
					fontSize,
					fontFamily: style.fontFamily,
					transform,
				};
			});
			setTextLayer(lodash.sortBy(textResult, ['coords.top', 'coords.left']));
		},
		[context, scale],
	);

	return { textLayer, buildTextLayer };
};

export default useTextLayer;
