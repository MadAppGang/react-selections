const getClientYWithGlobalOffset = (globalOffset) => {
  return function getClientY(event) {
    if (event.changedTouches) {
      return  event.changedTouches[0].clientY + globalOffset;
    }

    return event.clientY + globalOffset;
  }
};

export const getClientY = getClientYWithGlobalOffset(window.pageYOffset);

export { getClientYWithGlobalOffset };
