import React from 'react';
import errorVisual from '../assets/icons/error.svg';

interface Props {
	message?: string;
}

const Error = ({ message = 'Something went wrong.' }: Props) => {
	return (
		<div className="error-container">
			<img className="error-image" src={errorVisual} alt="Error" />
			<span className="error-message">{message}</span>
		</div>
	);
};

export default Error;
