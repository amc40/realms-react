type RGB = {
  r: number;
  g: number;
  b: number;
};

export function rgbToCssString({ r, g, b }: RGB): string {
  return `rgb(${r},${g},${b})`;
}

export default RGB;
