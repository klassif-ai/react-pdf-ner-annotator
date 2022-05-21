import hash from 'object-hash';

export const generateRandomHash = (): string => {
  const rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return hash({
    dateTime: new Date().toLocaleString(),
    rand,
  });
}
