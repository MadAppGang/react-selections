export const setCursor = (cursorName) => {
  document.body.className = '';
  document.body.classList.add(cursorName);
};

export default {
  GRAB: 'grab',
  GRABBING: 'grabbing',
  DEFAULT: 'default',
};
