/**
 * Theme Canvas Manager
 * Creates and manages separate canvas animations for each theme color
 * This approach ensures cross-browser compatibility by avoiding dynamic color changes
 */
(function () {
  // Theme colors
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
  };

  // Canvas references by theme
  const canvases = {};
  const contexts = {};

  // Particles for each theme
  const themeParticles = {};

  // Animation frames by theme
  const animationFrames = {};

  // Current active theme
  let currentTheme = "";

  // Initialize when DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Initializing theme canvas manager");

    // Create container for our canvases
    const container =
      document.querySelector("#bgCanvasContainer") || document.body;
    const canvasContainer = document.createElement("div");
    canvasContainer.id = "themeCanvasContainer";
    canvasContainer.style.position = "fixed";
    canvasContainer.style.top = "0";
    canvasContainer.style.left = "0";
    canvasContainer.style.width = "100%";
    canvasContainer.style.height = "100%";
    canvasContainer.style.zIndex = "-1";
    canvasContainer.style.overflow = "hidden";
    container.appendChild(canvasContainer);

    // Hide original canvas if it exists
    const originalCanvas = document.getElementById("bgCanvas");
    if (originalCanvas) {
      originalCanvas.style.display = "none";
    }

    // Create a canvas for each theme
    Object.keys(themeColors).forEach((theme) => {
      createCanvasForTheme(theme, themeColors[theme], canvasContainer);
    });

    // Set initial theme
    detectCurrentTheme();

    // Add listeners for theme changes
    setupThemeChangeListeners();

    // Handle window resize
    window.addEventListener("resize", handleResize);
  });

  /**
   * Creates a canvas for a specific theme
   */
  function createCanvasForTheme(theme, color, container) {
    // Create canvas element
    const canvas = document.createElement("canvas");
    canvas.id = `bgCanvas-${theme}`;
    canvas.className = "theme-bg-canvas";
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "none"; // Hide initially

    // Set dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Add to container
    container.appendChild(canvas);

    // Store references
    canvases[theme] = canvas;
    contexts[theme] = canvas.getContext("2d");

    // Create particles for this theme
    themeParticles[theme] = [];

    // Calculate particle count based on screen size
    const particleCount = Math.min(
      150,
      Math.floor((window.innerWidth * window.innerHeight) / 12000)
    );

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      themeParticles[theme].push(
        new Particle(canvas.width, canvas.height, color)
      );
    }

    // Start animation for this theme
    startAnimationForTheme(theme);

    return canvas;
  }

  /**
   * Particle class
   */
  class Particle {
    constructor(canvasWidth, canvasHeight, color) {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.size = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.color = color;
      this.alpha = Math.random() * 0.8 + 0.2;
      this.connectionDistance = 150;
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
    }

    update() {
      // Update position
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > this.canvasWidth) {
        this.vx *= -1;
        this.vx += (Math.random() - 0.5) * 0.1; // Add some randomness
      }

      if (this.y < 0 || this.y > this.canvasHeight) {
        this.vy *= -1;
        this.vy += (Math.random() - 0.5) * 0.1;
      }

      // Reset if too far outside or velocity is too small
      if (
        this.x < -50 ||
        this.x > this.canvasWidth + 50 ||
        this.y < -50 ||
        this.y > this.canvasHeight + 50 ||
        (Math.abs(this.vx) < 0.01 && Math.abs(this.vy) < 0.01)
      ) {
        this.x = Math.random() * this.canvasWidth;
        this.y = Math.random() * this.canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
      }
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  /**
   * Start animation loop for a theme
   */
  function startAnimationForTheme(theme) {
    const canvas = canvases[theme];
    const ctx = contexts[theme];
    const particles = themeParticles[theme];

    function animate() {
      // Clear canvas with semi-transparent background
      ctx.fillStyle = document.body.classList.contains("light-mode")
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);

        // Draw connections between particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < particles[i].connectionDistance) {
            const opacity = 1 - distance / particles[i].connectionDistance;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = opacity * 0.2;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      // Add mouse interaction if available
      if (window.mouseX !== undefined && window.mouseY !== undefined) {
        applyMouseInfluence(particles);
      }

      // Continue animation loop
      animationFrames[theme] = requestAnimationFrame(animate);
    }

    // Start animation
    animate();
  }

  /**
   * Apply mouse influence to particles
   */
  function applyMouseInfluence(particles) {
    const influenceRadius = 180;

    for (const particle of particles) {
      const dx = window.mouseX - particle.x;
      const dy = window.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < influenceRadius) {
        const force = (influenceRadius - distance) / influenceRadius;
        particle.vx += dx * force * 0.01;
        particle.vy += dy * force * 0.01;

        // Limit velocity
        const speed = Math.sqrt(
          particle.vx * particle.vx + particle.vy * particle.vy
        );
        if (speed > 1.2) {
          particle.vx = (particle.vx / speed) * 1.2;
          particle.vy = (particle.vy / speed) * 1.2;
        }
      }
    }
  }

  /**
   * Detect current theme from body classes
   */
  function detectCurrentTheme() {
    const bodyClasses = Array.from(document.body.classList);

    // Look for theme classes
    for (const theme of Object.keys(themeColors)) {
      if (bodyClasses.includes(theme)) {
        switchToTheme(theme);
        return;
      }
    }

    // Default to cyan if no theme found
    switchToTheme("theme-cyan");
  }

  /**
   * Switch to a specific theme
   */
  function switchToTheme(theme) {
    console.log(`Switching to theme: ${theme}`);

    // Hide all canvases
    Object.values(canvases).forEach((canvas) => {
      canvas.style.display = "none";
    });

    // Show the canvas for selected theme
    if (canvases[theme]) {
      canvases[theme].style.display = "block";
      currentTheme = theme;
    } else {
      console.warn(`Canvas for theme ${theme} not found`);
      // Fallback to default
      if (canvases["theme-cyan"]) {
        canvases["theme-cyan"].style.display = "block";
        currentTheme = "theme-cyan";
      }
    }
  }

  /**
   * Setup listeners for theme changes
   */
  function setupThemeChangeListeners() {
    // Watch for class changes on body
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "class") {
          detectCurrentTheme();
        }
      });
    });

    observer.observe(document.body, { attributes: true });

    // Also listen for clicks on theme buttons
    document.addEventListener("click", function (e) {
      const themeBtn = e.target.closest(
        "[data-theme], .theme-btn, .color-option"
      );
      if (themeBtn) {
        // Use setTimeout to ensure class changes have taken effect
        setTimeout(detectCurrentTheme, 50);
      }
    });
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    // Update all canvas sizes
    Object.keys(canvases).forEach((theme) => {
      const canvas = canvases[theme];
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Update particle canvas size references
      themeParticles[theme].forEach((particle) => {
        particle.canvasWidth = canvas.width;
        particle.canvasHeight = canvas.height;
      });
    });
  }

  // Track mouse position for interactive effect (same as original)
  window.mouseX = undefined;
  window.mouseY = undefined;

  window.addEventListener("mousemove", function (e) {
    window.mouseX = e.clientX;
    window.mouseY = e.clientY;
  });

  window.addEventListener("touchmove", function (e) {
    if (e.touches.length > 0) {
      window.mouseX = e.touches[0].clientX;
      window.mouseY = e.touches[0].clientY;
    }
  });

  window.addEventListener("touchend", function () {
    window.mouseX = undefined;
    window.mouseY = undefined;
  });

  // Make functions available globally
  window.themeCanvasManager = {
    switchToTheme,
    detectCurrentTheme,
    refreshCanvases: handleResize,
  };
})();
