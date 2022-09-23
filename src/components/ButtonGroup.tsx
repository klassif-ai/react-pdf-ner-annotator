import React from 'react';

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
					<span role="button" className="fab-group__button">
						<i className="bi-table fab-group__button-icon" />
					</span>
				</li>
				<li className="fab-group__list-item">
					<span role="button" className="fab-group__button" onClick={() => incrementScale(0.1)}>
						<i className="bi-plus-lg fab-group__button-icon" />
					</span>
				</li>
				<li className="fab-group__list-item">
					<span role="button" className="fab-group__button" onClick={() => incrementScale(-0.1)}>
						<i className="bi-dash-lg fab-group__button-icon" />
					</span>
				</li>
			</ul>
		</nav>
	);
};

export default ButtonGroup;
