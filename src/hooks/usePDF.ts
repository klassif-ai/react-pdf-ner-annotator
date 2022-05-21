import { useEffect, useState, useCallback } from 'react';
// @ts-ignore
import * as PdfJs from 'pdfjs-dist/build/pdf.min';
// @ts-ignore
import * as PdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

interface Props {
	url?: string;
	data?: Uint8Array | BufferSource | string;
	httpHeaders?: {
		[key: string]: string;
	};
}

const baseHeaders = {
	Accept: 'application/pdf',
};

const usePDF = ({ url, data, httpHeaders }: Props) => {
	PdfJs.GlobalWorkerOptions.workerSrc = PdfWorker;

	const [pages, setPages] = useState(0);
	const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		setPages(0);
		setDocument(null);
		setError(true);

		const pdfParams = {
			url,
			httpHeaders: {
				...baseHeaders,
				...httpHeaders,
			},
		};

		PdfJs.getDocument(url ? pdfParams : data)
			.promise.then((pdf: PDFDocumentProxy) => {
				setPages(pdf.numPages);
				setDocument(pdf);
				setError(false);
			})
			.catch(() => {
				setPages(0);
				setDocument(null);
				setError(true);
			});
	}, [url, data, httpHeaders]);

	const fetchPage = useCallback(
		(index: number): Promise<PDFPageProxy> | null => {
			if (document) {
				return document.getPage(index);
			}
			return null;
		},
		[document],
	);

	return { pages, error, fetchPage };
};

export default usePDF;
