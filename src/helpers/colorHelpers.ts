const cutHex = (hex: string): string => {
  return (hex.charAt(0) === '#') ? hex.substring(1, 7) : hex;
};
const hexToR = (hex: string): number => {
  return parseInt((cutHex(hex)).substring(0, 2), 16);
};

const hexToG = (hex: string): number => {
  return parseInt((cutHex(hex)).substring(2, 4), 16);
};

const hexToB = (hex: string): number => {
  return parseInt((cutHex(hex)).substring(4, 6), 16);
};

export const getAccessibleTextColor = (backgroundColorHex: string): string => {
  const threshold = 148;
  const hRed = hexToR(backgroundColorHex);
  const hGreen = hexToG(backgroundColorHex);
  const hBlue = hexToB(backgroundColorHex);

  const colorBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
  let textColor = '#000000';

  if (colorBrightness < threshold) {
    textColor = '#FFFFFF';
  }

  return textColor;
};
