import React from 'react';
import plus from '../../assets/icons/plus.svg';
import minus from '../../assets/icons/dash.svg';
import './ButtonGroup.scss';

interface Props {
  scale: number;
  setScale: (scale: number) => void;
}

const ButtonGroup = ({ scale, setScale }: Props) => {
  const incrementScale = (increment: number) => {
    const newScale = Math.round((scale + increment) * 10) / 10;
    if (newScale <= 2 && newScale >= 1) {
      setScale(newScale);
    }
  };

  return (
    <nav className="fab-group-container">
      <ul className="fab-group__list">
        <li className="fab-group__list-item">
          <span
            className="fab-group__info"
          >
            {scale}
          </span>
        </li>
        <li className="fab-group__list-item">
          <span
            role="button"
            className="fab-group__button"
            onClick={() => incrementScale(.1)}
          >
            <img className="fab-group__button-icon" src={plus} alt="Zoom in" />
          </span>
        </li>
        <li className="fab-group__list-item">
          <span
            role="button"
            className="fab-group__button"
            onClick={() => incrementScale(-.1)}
          >
            <img className="fab-group__button-icon" src={minus} alt="Zoom out" />
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default ButtonGroup;
