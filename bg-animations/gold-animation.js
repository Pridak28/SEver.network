document.addEventListener("DOMContentLoaded", () => {
  const c = document.createElement("canvas");
  c.id = "anim-gold";
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
  if (typeof startThemeAnimation === "function") {
    startThemeAnimation(c, "#ffd700");
  }
});
