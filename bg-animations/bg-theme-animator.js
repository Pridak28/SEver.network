(() => {
  const themeColors = {
    "theme-cyan": "#00ffff",
    "theme-purple": "#cc00ff",
    "theme-green": "#00ff80",
    "theme-orange": "#ff8000",
    "theme-blue": "#0055ff",
    "theme-red": "#ff0055",
    "theme-neon": "#0cff53",
    "theme-gold": "#ffd700",
    "theme-white": "#ffffff",
    "theme-black": "#ffffff", // ensure white particles on black theme
  };
  // tuned for smoother performance
  const maxCount = 150, // was 400
    connDist = 120, // reduced connections
    attractRadius = 150,
    attractStrength = 0.1;
  let canvas,
    ctx,
    particles = [];
  let w,
    h,
    color = "#00ffff";
  let mouseX = null,
    mouseY = null;

  function initCanvas() {
    // use existing bgCanvas or create if missing
    canvas = document.getElementById("bgCanvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "bgCanvas";
      document.body.insertBefore(canvas, document.body.firstChild);
    }
    Object.assign(canvas.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "0", // was "-1"
    });
    ctx = canvas.getContext("2d");

    onResize();

    // track pointer
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    window.addEventListener("mouseout", () => {
      mouseX = mouseY = null;
    });
  }

  function onResize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    resetParticles();
  }

  function getThemeColor() {
    for (const cls of Object.keys(themeColors)) {
      if (document.body.classList.contains(cls)) return themeColors[cls];
    }
    return themeColors["theme-cyan"];
  }

  function resetParticles() {
    particles = [];
    color = getThemeColor();
    // sync CSS var for particle color
    document.documentElement.style.setProperty("--particle-color", color);

    for (let i = 0; i < Math.min(maxCount, (w * h) / 8000); i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 16, // was *32
        vy: (Math.random() - 0.5) * 16,
        r: Math.random() * 2 + 1,
        a: Math.random() * 0.6 + 0.3,
        tail: [],
        tailLength: Math.floor(Math.random() * 10) + 5, // was up to ~30
      });
    }
  }

  let startTime = Date.now();
  let lastTheme = document.body.className;

  function animate() {
    const body = document.body;
    const isWhite = body.classList.contains("theme-white");
    const isBlack = body.classList.contains("theme-black");

    // always clear to black in both modes
    ctx.fillStyle =
      isWhite || isBlack
        ? "#000"
        : body.classList.contains("light-mode")
        ? "rgba(255,255,255,0.06)"
        : "rgba(0,0,0,0.06)";
    ctx.fillRect(0, 0, w, h);

    // set particle color from CSS var
    const pCol =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--particle-color")
        .trim() || "#fff";
    ctx.fillStyle = pCol;
    ctx.strokeStyle = pCol;

    // if theme class changed, restart the initial slowdown period
    const currentTheme = document.body.className;
    if (currentTheme !== lastTheme) {
      startTime = Date.now();
      lastTheme = currentTheme;
    }

    // for first 2s after load or theme‐switch, half movement speed
    const elapsed = Date.now() - startTime;
    const moveFactor = elapsed < 2000 ? 0.5 : 1;

    particles.forEach((p, i) => {
      // apply mouse attraction
      if (mouseX !== null) {
        const dx = mouseX - p.x,
          dy = mouseY - p.y,
          d = Math.hypot(dx, dy);
        if (d < attractRadius) {
          p.vx += (dx / d) * attractStrength * 4; // stronger pull
          p.vy += (dy / d) * attractStrength * 4;
        }
      }

      // move
      p.x += p.vx * moveFactor;
      p.y += p.vy * moveFactor;
      p.vx *= 0.98;
      p.vy *= 0.98;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // update trail
      p.tail.unshift({ x: p.x, y: p.y });
      if (p.tail.length > p.tailLength) p.tail.pop();

      // draw glitch trail
      ctx.lineWidth = p.r * 1.2; // thicker trails
      for (let k = 0; k < p.tail.length - 1; k++) {
        const p1 = p.tail[k],
          p2 = p.tail[k + 1],
          alpha = (1 - k / p.tail.length) * p.a * 0.5;
        ctx.beginPath();
        ctx.globalAlpha = alpha;
        // small horizontal glitch offset
        const off = (Math.random() - 0.5) * 2;
        ctx.moveTo(p1.x + off, p1.y);
        ctx.lineTo(p2.x + off, p2.y);
        // occasional color glitch
        ctx.strokeStyle = Math.random() < 0.1 ? "#fff" : pCol;
        ctx.stroke();
      }

      // draw particle
      ctx.globalAlpha = p.a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fill();

      // connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j],
          dx = p.x - q.x,
          dy = p.y - q.y,
          d = Math.hypot(dx, dy);
        if (d < connDist) {
          ctx.globalAlpha = (1 - d / connDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.lineWidth = 2.8; // thicker connection lines
          ctx.stroke();
        }
      }
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }

  // observe theme changes
  const mo = new MutationObserver((muts) => {
    for (const m of muts) if (m.attributeName === "class") resetParticles();
  });

  document.addEventListener("DOMContentLoaded", () => {
    initCanvas();
    window.addEventListener("resize", onResize);
    mo.observe(document.body, { attributes: true });
    animate();
  });
})();
