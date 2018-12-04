const calculateArea = ({ width, height }) => width * height;

export const sortByArea = (box1, box2) => {
  const area1 = calculateArea(box1.area.dimensions);
  const area2 = calculateArea(box2.area.dimensions);

  return area2 - area1;
};