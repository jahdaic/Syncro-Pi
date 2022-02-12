/**
 * Convert a string into title/proper case
 * @param {String} str - The text to convert 
 * @returns {String}
 */
export const toTitleCase = str => 
	str.replace(/\w\S*/g, txt => (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));

/**
 * Converts a time value in milliseconds to a MM:SS string
 * @param {Number} time - The duration in milliseconds
 * @returns {String}
 */
export const msToDuration = (time) => {
	const minutes = Math.floor(time / 1000 / 60) || 0;
	let seconds = Math.floor(time / 1000 % 60) || 0;

	if(seconds < 10) seconds = `0${seconds}`;

	return `${minutes}:${seconds}`;
};

/**
 * Converts a ratio of two numbers into a percentage number
 * @param {Number} part - A portion of the total
 * @param {Number} total - The total value
 * @returns {Number}
 */
export const ratioToPercent = (part, total) => part >= total ? 100 : part / total * 100;

/**
 * Converts a velocity from meters per second to miles per hour
 * @param {Number} mps - The velocity to convert in meters per second 
 * @returns {Number}
 */
export const mpsToMPH = (mps) => mps * 2.236936;

/**
 * Converts a distance from meters to feet
 * @param {Number} m - The distance to convert in meters 
 * @returns {Number}
 */
export const metersToFeet = (m) => m * 3.28084;

export const randomString = (length) => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	let str = '';
	for (let i = 0; i < length; i++) {
		str += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return str;
};

export const hashString = async (str) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(str);
	const hash = await crypto.subtle.digest('SHA-256', data);
	return hash;
};

export const base64URLEncode = (str) => 
	btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');