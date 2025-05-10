/**
 * Converts a string to title case
 * @param {string} str - String to convert
 * @returns {string} Title cased string
 */
export const toTitleCase = (str) => {
    return str.toLowerCase().replace(/(^|\s)\w/g, letter => letter.toUpperCase());
  };