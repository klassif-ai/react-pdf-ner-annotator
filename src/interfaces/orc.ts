import { TextLayerItem } from './textLayer';

export interface OCRResult {
	confidence: number;
	ocrWords: Array<TextLayerItem>;
	baseScale: number;
}
