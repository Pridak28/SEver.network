/**
 * Enhanced Background Particle Animation
 * Creates moving particles with connections like sever.network
 * Properly coordinates with loading animation
 */
(function () {
  "use strict";

  let canvas,
    ctx,
    particles = [],
    animationId;
  let isInitialized = false;
  let isVisible = false;

  // Enhanced configuration for better visual effect
  // Detect if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

  const config = {
    particleCount: isMobile ? 28 : 80, // lighter, focused field on mobile
    connectionDistance: isMobile ? 120 : 150,
    particleSpeed: isMobile ? 0.45 : 0.8,
    particleSize: { min: isMobile ? 2 : 1, max: isMobile ? 4 : 3 },
    connectionOpacity: isMobile ? 0.25 : 0.15,
    particleOpacity: isMobile ? 0.6 : 0.7,
    mouseInteraction: !isMobile,
    fps: isMobile ? 45 : 60,
  };

  // Initialize the animation system
  function init() {
    // Check if loading animation is still running
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay && loadingOverlay.style.display !== "none") {
      setTimeout(init, 1000);
      return;
    }

    if (isInitialized) return;

    if (isMobile) {
      applyMobileBackground();
    }

    if (isInitialized) return;

    console.log("Initializing enhanced background particle animation");

    createCanvas();
    createParticles();
    startAnimation();
    setupEventListeners();

    isInitialized = true;
    isVisible = true;
  }

  // Create and setup canvas
  function createCanvas() {
    // Remove any existing background canvases
    document
      .querySelectorAll("#bgCanvas, #simple-bg-canvas, .theme-canvas")
      .forEach((el) => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });

    canvas = document.createElement("canvas");
    canvas.id = "bgCanvas";
    // ALWAYS use fixed positioning - covers viewport during scroll
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      pointer-events: none;
      opacity: 1;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    `;

    console.log(`🎨 Creating canvas with FIXED position, Mobile: ${isMobile}`);

    // Insert at the beginning of body to ensure it's behind everything
    document.body.insertBefore(canvas, document.body.firstChild);

    // Log final computed position after insertion
    setTimeout(() => {
      const computed = window.getComputedStyle(canvas);
      console.log(`✅ Canvas inserted. Computed position: ${computed.position}, width: ${computed.width}, height: ${computed.height}`);
    }, 100);
    ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
      willReadFrequently: false
    });

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    resizeCanvas();
  }

  // Resize canvas to match window (ALWAYS viewport size with fixed positioning)
  function resizeCanvas() {
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance
    const width = window.innerWidth;
    const height = window.innerHeight; // Always use viewport height with fixed positioning

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    console.log(`🎨 Canvas resized - Width: ${width}px, Height: ${height}px, DPR: ${dpr}`);

    // Reset context settings after resize
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.scale(dpr, dpr);

    // Recreate particles for new dimensions
    createParticles();
  }

  // Create particle system with MOVING particles
  function createParticles() {
    particles = [];
    const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = canvas.height / (window.devicePixelRatio || 1);

    console.log(`🎨 Creating ${config.particleCount} moving particles - Canvas: ${canvasWidth}x${canvasHeight}`);

    const count = config.particleCount;

    // Create particles with random positions and velocities
    for (let i = 0; i < count; i++) {
      // Give particles different movement patterns
      const angle = Math.random() * Math.PI * 2;
      const speed = config.particleSpeed * (0.5 + Math.random() * 0.5); // Vary speed

      particles.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        vx: Math.cos(angle) * speed, // Movement in x direction
        vy: Math.sin(angle) * speed, // Movement in y direction
        size:
          Math.random() * (config.particleSize.max - config.particleSize.min) +
          config.particleSize.min,
        alpha: Math.random() * 0.3 + 0.5, // Higher alpha for visibility
        pulseSpeed: Math.random() * 0.01 + 0.005,
        baseAlpha: Math.random() * 0.3 + 0.5,
      });
    }

    console.log(
      `Created ${particles.length} particles for background animation`
    );
  }

  // Get current theme color
  function getThemeColor() {
    const bodyClasses = Array.from(document.body.classList);

    if (bodyClasses.includes("theme-neon")) return "#0cff53";
    if (bodyClasses.includes("theme-purple")) return "#cc00ff";
    if (bodyClasses.includes("theme-blue")) return "#0055ff";
    if (bodyClasses.includes("theme-red")) return "#ff0055";
    if (bodyClasses.includes("theme-white")) return "#ffffff";
    if (bodyClasses.includes("theme-gold")) return "#ffd700";
    if (bodyClasses.includes("theme-green")) return "#00ff80";
    if (bodyClasses.includes("theme-orange")) return "#ff8000";

    return "#00ffff"; // Default cyan
  }

  function hexToRgba(hex, alpha) {
    const sanitized = hex.replace("#", "");
    const bigint = parseInt(sanitized.length === 3
        ? sanitized.replace(/(.)/g, "$1$1")
        : sanitized,
      16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Animation loop with FPS limiting for mobile
  let lastFrameTime = 0;
    const frameInterval = 1000 / config.fps;

  function animate(currentTime) {
    if (!canvas || !ctx || !isVisible) {
      animationId = requestAnimationFrame(animate);
      return;
    }

    // FPS limiting for mobile
    if (currentTime - lastFrameTime < frameInterval) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    lastFrameTime = currentTime;

    const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = canvas.height / (window.devicePixelRatio || 1);

    // Clear ENTIRE canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background - SAME AS DESKTOP
    const isLightMode = document.body.classList.contains("light-mode");
    ctx.fillStyle = isLightMode ? "rgba(240, 244, 255, 0.95)" : "rgba(2, 7, 12, 1)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const themeColor = getThemeColor();
    const time = Date.now() * 0.001;

    // Update and draw particles
    particles.forEach((particle, index) => {
      updateParticle(particle, canvasWidth, canvasHeight);
      drawParticle(particle, themeColor, time, index);
    });

    // Draw connections between particles
    drawAllConnections(themeColor);

    animationId = requestAnimationFrame(animate);
  }

  function applyMobileBackground() {
    document.body.classList.add("mobile-bg-gradient");
  }

  // Update particle position
  function updateParticle(particle, width, height) {
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Bounce off edges with slight randomness
    if (particle.x < 0 || particle.x > width) {
      particle.vx *= -1;
      particle.x = Math.max(0, Math.min(width, particle.x));
    }
    if (particle.y < 0 || particle.y > height) {
      particle.vy *= -1;
      particle.y = Math.max(0, Math.min(height, particle.y));
    }

    // Add slight random drift to prevent particles from getting stuck
    if (Math.abs(particle.vx) < 0.1) particle.vx += (Math.random() - 0.5) * 0.1;
    if (Math.abs(particle.vy) < 0.1) particle.vy += (Math.random() - 0.5) * 0.1;

    // Limit max speed
    const speed = Math.sqrt(
      particle.vx * particle.vx + particle.vy * particle.vy
    );
    if (speed > config.particleSpeed * 2) {
      particle.vx = (particle.vx / speed) * config.particleSpeed * 2;
      particle.vy = (particle.vy / speed) * config.particleSpeed * 2;
    }
  }

  // Draw individual particle with subtle glow
  function drawParticle(particle, themeColor, time, index) {
    const pulseAlpha =
      particle.baseAlpha + Math.sin(time * particle.pulseSpeed + index) * 0.2;

    const alpha = Math.max(0.1, Math.min(config.particleOpacity, pulseAlpha));

    // Draw soft glow (larger, transparent)
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(themeColor, alpha * 0.2);
    ctx.fill();

    // Draw core particle
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(themeColor, alpha);
    ctx.fill();
  }

  // Draw all connections between particles
  function drawAllConnections(themeColor) {
    const maxConnections = isMobile ? 4 : 8;

    for (let i = 0; i < particles.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < particles.length; j++) {
        if (connections >= maxConnections) break;
        const particle1 = particles[i];
        const particle2 = particles[j];
        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.connectionDistance) {
          const opacity =
            (1 - distance / config.connectionDistance) *
            config.connectionOpacity;

          ctx.beginPath();
          ctx.moveTo(particle1.x, particle1.y);
          ctx.lineTo(particle2.x, particle2.y);
          ctx.strokeStyle = hexToRgba(themeColor, opacity);
          ctx.lineWidth = isMobile ? 0.35 : 0.5;
          ctx.stroke();
          connections++;
        }
      }
    }
  }

  // Start animation
  function startAnimation() {
    if (animationId) cancelAnimationFrame(animationId);
    animate();
  }

  // Setup event listeners
  function setupEventListeners() {
    window.addEventListener("resize", resizeCanvas);

    // Watch for theme changes
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "class") {
          // Theme changed, animation will automatically use new color
        }
      });
    });
    observer.observe(document.body, { attributes: true });

    // Hide animation when loading overlay is visible
    const loadingObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        const loadingOverlay = document.getElementById("loadingOverlay");
        if (loadingOverlay) {
          isVisible =
            loadingOverlay.style.display === "none" ||
            getComputedStyle(loadingOverlay).display === "none";
        }
      });
    });

    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
      loadingObserver.observe(loadingOverlay, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }
  }

  // Public API
  window.bgAnimation = {
    init: init,
    show: function () {
      isVisible = true;
      if (canvas) canvas.style.opacity = "1";
    },
    hide: function () {
      isVisible = false;
      if (canvas) canvas.style.opacity = "0";
    },
    refresh: function () {
      if (isInitialized) {
        createParticles();
      } else {
        init();
      }
    },
    destroy: function () {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      isInitialized = false;
      isVisible = false;
      particles = [];
    },
  };

  // Initialize when DOM is ready and loading is complete
  function checkAndInit() {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (
      !loadingOverlay ||
      loadingOverlay.style.display === "none" ||
      getComputedStyle(loadingOverlay).display === "none"
    ) {
      init();
    } else {
      setTimeout(checkAndInit, 500);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      setTimeout(checkAndInit, 1000)
    );
  } else {
    setTimeout(checkAndInit, 1000);
  }
})();
