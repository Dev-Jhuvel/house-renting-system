export const toTitleCase = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

export const toOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};