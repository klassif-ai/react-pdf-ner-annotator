export const generateRandomId = (length: number): string => Array(length).fill(0).map(x => Math.random().toString(36).charAt(2)).join('');
