import { useEffect, useState, useCallback } from 'react';
// @ts-ignore
import * as PdfJs from 'pdfjs-dist/build/pdf.min';
// @ts-ignore
import * as PdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { PDFDocumentProxy, PDFPageProxy, PDFPromise } from 'pdfjs-dist';

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
  const [document, setDocument] = useState<PDFDocumentProxy|null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setPages(0);
    setDocument(null);
    setError(true);

    let pdfParams;
    if (url) {
      pdfParams = {
        url,
        httpHeaders: {
          ...baseHeaders,
          ...httpHeaders,
        }
      };
    } else if (data) {
      pdfParams = data;
    }

    if (pdfParams) {
      setPages(0);
      setDocument(null);
      setError(false);
      PdfJs.getDocument(pdfParams).promise
        .then((pdf: PDFDocumentProxy) => {
          setPages(pdf.numPages);
          setDocument(pdf);
          setError(false);
        })
        .catch(() => {
          setPages(0);
          setDocument(null);
          setError(true);
        });
    }
  }, [url, data, httpHeaders]);

  const fetchPage = useCallback((index: number): PDFPromise<PDFPageProxy>|null => {
    if (document) {
      return document.getPage(index);
    }
    return null;
  }, [document]);

  return { pages, error, fetchPage };
};

export default usePDF;
