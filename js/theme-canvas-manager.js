let lastTime = 0;
function animateCanvas(time) {
  const delta = time - lastTime;
  lastTime = time;
  // ...existing draw logic using delta...
  requestAnimationFrame(animateCanvas);
}
// start loop after DOM ready
window.addEventListener("load", () => {
  requestAnimationFrame(animateCanvas);
});
