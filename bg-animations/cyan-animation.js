/**
 * Cyan Theme Animation
 * Pre-configured animation for the cyan theme
 */
(() => {
  createThemeAnimation("theme-cyan", "#00ffff");

  function createThemeAnimation(theme, color) {
    document.addEventListener("DOMContentLoaded", () => {
      const canvas = document.createElement("canvas");
      canvas.id = `${theme}-canvas`;
      canvas.className = "theme-specific-canvas";
      canvas.style.cssText =
        "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;display:none;";

      document.body.appendChild(canvas);

      // Set up canvas
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");

      // Create particles
      const particles = createParticles(canvas.width, canvas.height, color);

      // Start animation
      requestAnimationFrame(() => animate(canvas, ctx, particles));

      // Show this canvas if matching the current theme
      checkThemeAndDisplay(theme, canvas);

      // Handle resize
      window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });

      // Listen for theme changes
      listenForThemeChanges(theme, canvas);
    });
  }

  function createParticles(width, height, color) {
    const particles = [];
    const count = Math.min(150, Math.floor((width * height) / 12000));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: color,
        alpha: Math.random() * 0.8 + 0.2,
        connectionDistance: 150,
      });
    }

    return particles;
  }

  function animate(canvas, ctx, particles) {
    // Background based on mode
    const isLightMode = document.body.classList.contains("light-mode");
    ctx.fillStyle = isLightMode
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > canvas.width) {
        p.vx *= -1;
        p.vx += (Math.random() - 0.5) * 0.1;
      }

      if (p.y < 0 || p.y > canvas.height) {
        p.vy *= -1;
        p.vy += (Math.random() - 0.5) * 0.1;
      }

      // Reset if needed
      if (
        p.x < -50 ||
        p.x > canvas.width + 50 ||
        p.y < -50 ||
        p.y > canvas.height + 50 ||
        (Math.abs(p.vx) < 0.01 && Math.abs(p.vy) < 0.01)
      ) {
        p.x = Math.random() * canvas.width;
        p.y = Math.random() * canvas.height;
        p.vx = (Math.random() - 0.5) * 0.3;
        p.vy = (Math.random() - 0.5) * 0.3;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < p.connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - distance / p.connectionDistance) * 0.2;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
    }

    // Continue animation
    requestAnimationFrame(() => animate(canvas, ctx, particles));
  }

  function checkThemeAndDisplay(theme, canvas) {
    if (document.body.classList.contains(theme)) {
      // Hide all other theme canvases
      document.querySelectorAll(".theme-specific-canvas").forEach((c) => {
        c.style.display = "none";
      });
      // Show this theme's canvas
      canvas.style.display = "block";
    }
  }

  function listenForThemeChanges(theme, canvas) {
    const observer = new MutationObserver(() => {
      checkThemeAndDisplay(theme, canvas);
    });

    observer.observe(document.body, { attributes: true });

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-theme], .theme-btn, .color-option")) {
        setTimeout(() => checkThemeAndDisplay(theme, canvas), 10);
      }
    });
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const c = document.createElement("canvas");
  c.id = "anim-cyan";
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
  startThemeAnimation(c, "#00ffff");
});
