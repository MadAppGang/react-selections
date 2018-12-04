export const Cursors = {
  GRAB: 'grab',
  GRABBING: 'grabbing',
  DEFAULT: 'default',
};

export const setCursor = (cursorName) => {
  document.body.className = '';
  document.body.classList.add(cursorName);
};
