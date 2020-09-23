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
  const [prevUrl, setPrevUrl] = useState(null);
  const [pages, setPages] = useState(0);
  const [document, setDocument] = useState<PDFDocumentProxy|null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
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
      pdfParams = {
        url,
        httpHeaders: {
          ...baseHeaders,
          ...httpHeaders,
        }
      };
    } else {
      setPages(0);
      setDocument(null);
      setError(true);
    }

    if (pdfParams) {
      PdfJs.getDocument({
        url,
        httpHeaders,
      }).promise
        .then((pdf: PDFDocumentProxy) => {
          if (prevUrl && url !== prevUrl){
            setPages(0);
            setDocument(null);
          }
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
    setPrevUrl(url)
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
