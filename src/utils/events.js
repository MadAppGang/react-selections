export const getClientY = (event) => {
  let output;
  if (event.changedTouches) {
    output = event.changedTouches[0].clientY;
  } else {
    output = event.clientY;
  }

  return output + window.pageYOffset;
};
