/**
 * Convert a string into title/proper case
 * @param {String} str - The text to convert 
 * @returns {String}
 */
export const toTitleCase = str => 
	str.replace(/\w\S*/g, txt => (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));

export default toTitleCase;