import React from 'react';
import arrowRepeat from '../assets/icons/arrow-repeat.svg';
import exclamationCircle from '../assets/icons/exclamation-circle.svg';
import checkCircle from '../assets/icons/check-circle.svg';
import Tooltip from './Tooltip';

interface Props {
  loading: boolean;
  error?: string;
  message?: string;
}

const OcrInfo = ({ loading, error, message }: Props) => {
  const renderIcon = () => {
    if (loading) {
      return (
        <Tooltip message="OCR is running...">
          <img src={arrowRepeat} className="ocr-info__icon ocr-info__icon-rotate" alt="loading icon" />
        </Tooltip>
      );
    }
    if (error) {
      return (
        <Tooltip message={error}>
          <img src={exclamationCircle} className="ocr-info__icon" alt="error icon" />
        </Tooltip>
      );
    }
    if (message) {
      return (
        <Tooltip message={message}>
          <img src={checkCircle} className="ocr-info__icon" alt="check icon" />
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <div className="ocr-info-container">
      { renderIcon() }
    </div>
  );
};

export default OcrInfo;
