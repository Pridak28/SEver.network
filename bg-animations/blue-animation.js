document.addEventListener("DOMContentLoaded", () => {
  const c = document.createElement("canvas");
  c.id = "anim-blue";
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
  startThemeAnimation(c, "#0055ff");
});
