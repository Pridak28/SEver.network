(() => {
  const maxCount = 100,
    connDist = 120;
  let w,
    h,
    canvas,
    ctx,
    particles = [],
    themeColor = "#00ffff";

  function setup(color) {
    themeColor = color;
    canvas = document.getElementById("bgCanvas") || createCanvas();
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
    reset();
    requestAnimationFrame(draw);
  }

  function createCanvas() {
    const c = document.createElement("canvas");
    c.id = "bgCanvas";
    Object.assign(c.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "0",
    });
    document.body.insertBefore(c, document.body.firstChild);
    return c;
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    reset();
  }

  function reset() {
    particles = [];
    for (let i = 0; i < maxCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 0.5,
      });
    }
  }

  function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = themeColor;
    ctx.strokeStyle = themeColor;
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j],
          dx = p.x - q.x,
          dy = p.y - q.y,
          d = Math.hypot(dx, dy);
        if (d < connDist) {
          ctx.globalAlpha = (1 - d / connDist) * 0.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(draw);
  }

  window.startBg = setup;
})();
