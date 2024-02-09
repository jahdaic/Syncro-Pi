/**
 * Convert a string into title/proper case
 * @param {String} str - The text to convert 
 * @returns {String}
 */
export const toTitleCase = str => 
	str?.replace(/\w\S*/g, txt => (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));

/**
 * Converts a time value in milliseconds to a MM:SS string
 * @param {Number} time - The duration in milliseconds
 * @returns {String}
 */
export const msToDuration = time => {
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
 * Converts a velocity from meters per second to miles per hour (kilometers per hours for metric)
 * @param {Number} mps - The velocity to convert in meters per second 
 * @returns {Number}
 */
export const mpsToMPH = mps => {
	if(localStorage.getItem('units') === 'imperial')
		return mps * 2.236936;
	
	return mps * 3.6;
};

/**
 * Converts a distance from meters to feet
 * @param {Number} m - The distance to convert in meters 
 * @returns {Number}
 */
export const metersToFeet = m => {
	if(localStorage.getItem('units') === 'imperial')
		return m * 3.28084;

	return m;
}

export const serializeDates = obj => {
	const newObj = {...obj};

	Object.keys(obj).forEach(key => {
		if(obj[key] instanceof Date)
			newObj[key] = obj[key].toISOString();
		else if(typeof obj[key] === 'object')
			newObj[key] = serializeDates(obj[key]);
	});

	return newObj;
};

/**
 * Generates a random string of letters and numbers
 * @param {Number} length - The length of the generated string
 * @returns 
 */
export const randomString = length => {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	let str = '';
	for (let i = 0; i < length; i++) {
		str += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return str;
};

/**
 * Encodes a string using an SHA-256 hash
 * @param {String} str - The string to be encoded
 * @returns 
 */
export const hashString = async str => {
	try {
		const encoder = new TextEncoder();
		const data = encoder.encode(str);
		const hash = await crypto.subtle?.digest('SHA-256', data);
		// throw new Error(`${data} - ${Cryp}`);
		return hash;
	}
	catch (err) {
		console.error(err);
		// throw new Error(`${err} - ${crypto}`);
		return '';
	};
};

/**
 * URL encode a base64 encoded string
 * @param {ArrayBuffer} str -A base64 encoded string
 * @returns 
 */
export const base64URLEncode = str => 
	btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

/**
 * Gets the child of a component as a string
 * @param params - The params of the XGrid column
 * @returns The child value as a string
 */
export const getColChildValueString = (params) => {
	const child = params?.value?.props?.children || params?.props?.children || params;

	if (typeof params.value === 'string') return params.value;
	if (typeof child === 'string' || typeof child === 'number') return child;
	if (Array.isArray(child)) return child.map(c => typeof c === 'object' ? getColChildValueString(c) : c).join('');
	if (Array.isArray(params?.value)) return params?.value.map(p => getColChildValueString(p)).join('');
	if (typeof child === 'object') return getColChildValueString(child);

	return '';
};

/**
 * Converts all characters in a string into ᛤ
 * @param {String} str - The string to convert
 * @param {String[]} exclude - Characters that should be exluded from conversion
 * @param {Number} before - Number of characters to add to the beginning of the string
 * @param {Number} after - Number of characters to add to the end of the string
 * @returns 
 */
export const generateUnlitLCD = (str, exclude = [], before = 0, after = 0) => {
	let newStr = typeof str === 'string' ? str : getColChildValueString(str);

	if(before) newStr = newStr.padStart(before, 'ᛤ');
	if(after) newStr = newStr.padEnd(after, 'ᛤ');

	return newStr?.split('').map(s => exclude.includes(s) ? s : 'ᛤ').join('');
};

export const fillUnlitLCD = (rows, columns) => {
	let text = '';

	for(let i = 0; i < rows; i++) {
		text += `${''.padEnd(columns, 'ᛤ')}\n`;
	}

	return text;
};

