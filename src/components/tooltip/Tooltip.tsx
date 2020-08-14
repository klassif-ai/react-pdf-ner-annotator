import React from 'react';
import './Tooltip.scss';

interface Props {
  children: React.ReactNode;
  message: string;
}

const Tooltip = ({ children, message }: Props) => {
  return (
    <div className="tooltip-container">
      { children }
      <span className="tooltip__text">{message}</span>
    </div>
  );
};

export default Tooltip;
