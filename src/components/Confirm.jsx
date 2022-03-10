import React, { useEffect, useState } from 'react';
import * as Utility from '../scripts/utility';

import '../css/modal.css';


const failureTolerance = 5;
const gyroscope = null;

export const Modal = ({children, onConfirm, onCancel, ...props}) => 

// useEffect(updatePosition, []);

	 <div id="confirm">
		<div id="confirm-modal">
			{children}
			<div id="confirm-buttons">
				<div id="performance-buttons">
					<button type="button" onClick={onConfirm}>
				Confirm
					</button>
					<button type="button" onClick={onCancel}>
				Cancel
					</button>
				</div>
			</div>
		</div>
	</div>


export default Modal;
