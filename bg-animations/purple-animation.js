/**
 * Purple Theme Animation
 * Pre-configured animation for the purple theme
 */
(() => {
  createThemeAnimation("theme-purple", "#cc00ff");

  // Same functions as in cyan-animation.js
  function createThemeAnimation(theme, color) {
    // Implementation identical to cyan-animation.js
  }

  function createParticles(width, height, color) {
    // Implementation identical to cyan-animation.js
  }

  function animate(canvas, ctx, particles) {
    // Implementation identical to cyan-animation.js
  }

  function checkThemeAndDisplay(theme, canvas) {
    // Implementation identical to cyan-animation.js
  }

  function listenForThemeChanges(theme, canvas) {
    // Implementation identical to cyan-animation.js
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const c = document.createElement("canvas");
  c.id = "anim-purple";
  c.width = innerWidth;
  c.height = innerHeight;
  Object.assign(c.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  });
  document.body.appendChild(c);
  startThemeAnimation(c, "#cc00ff");
});
