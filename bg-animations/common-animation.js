(function () {
  window.startThemeAnimation = function (canvas, color) {
    const ctx = canvas.getContext("2d");
    let w = canvas.width,
      h = canvas.height;
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: 1 + Math.random() * 2,
      });
    }
    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });
    (function anim() {
      ctx.fillStyle = document.body.classList.contains("light-mode")
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.1)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = color;
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j],
            dx = p.x - q.x,
            dy = p.y - q.y,
            d = Math.hypot(dx, dy);
          if (d < 100) {
            ctx.globalAlpha = (1 - d / 100) * 0.2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      });
      requestAnimationFrame(anim);
    })();
  };
})();
