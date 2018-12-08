export const calculateArea = (dimensions) => {
  if (typeof dimensions !== 'object') {
    return null;
  }

  const { width, height } = dimensions;

  return (width * height) || null;
}
