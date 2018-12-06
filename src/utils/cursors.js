function createSetCursor(global = document.body) {
  return function set(cursorName) {
    global.className = cursorName;
  };
}

export const setCursor = createSetCursor(document.body);

export { createSetCursor };

export default {
  GRAB: 'grab',
  GRABBING: 'grabbing',
  DEFAULT: 'default',
};
