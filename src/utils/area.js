export const calculateArea = (params) => {
  if (typeof params !== 'object') {
    return null;
  }

  const { width, height } = params;

  return (width * height) || null;
}

export const sortByArea = (box1, box2) => {
  if (!box1 || !box2) {
    return 0;
  }

  const area1 = calculateArea(box1.area.dimensions);
  const area2 = calculateArea(box2.area.dimensions);

  if (!area1 || !area2) {
    return 0;
  }

  return (area2 - area1);
};
