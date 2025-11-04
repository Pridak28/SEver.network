/**
 * Login Page Particle Animation
 * Creates a tech-inspired floating particle effect for the login background
 */
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.createElement("canvas");
  canvas.id = "loginParticlesCanvas";

  // Style the canvas to fill the background
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "1"; // Above the grid background but below the login container

  // Insert the canvas into the login page as the first child
  const loginPage = document.querySelector(".login-page");
  if (loginPage) {
    loginPage.insertBefore(canvas, loginPage.firstChild);

    // Initialize animation
    initParticleAnimation(canvas);
  }

  function initParticleAnimation(canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrame;
    let mouseX = 0;
    let mouseY = 0;

    // Get accent color from CSS variables
    const getAccentColor = () => {
      const color = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-color")
        .trim();
      return color || "#00ffff"; // Default to cyan if not found
    };

    const getAccentColorRGB = () => {
      const rgb = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-color-rgb")
        .trim();
      return rgb || "0, 255, 255"; // Default to cyan if not found
    };

    // Resize handler to keep canvas sized correctly
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Regenerate particles on resize
      createParticles();
    }

    // Mouse move handler to add interactivity
    function handleMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    // Create particles
    function createParticles() {
      particles = [];
      const particleCount = Math.min(window.innerWidth / 10, 150); // Responsive count, max 150

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          blinking: Math.random() > 0.7, // Some particles will blink
          blinkPhase: Math.random() * Math.PI * 2, // Random starting phase for blinking
          connectDistance: Math.random() * 150 + 50, // Random connect distance
        });
      }
    }

    // Draw animation frame
    function draw() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw connections first (so they appear behind particles)
      drawConnections();

      // Update and draw particles
      particles.forEach((particle) => {
        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Calculate opacity for blinking particles
        let opacity = particle.opacity;
        if (particle.blinking) {
          particle.blinkPhase += 0.02;
          opacity =
            particle.opacity * (0.5 + 0.5 * Math.sin(particle.blinkPhase));
        }

        // Mouse interaction - particles near the mouse move away slightly
        const mouseDistance = Math.hypot(
          mouseX - particle.x,
          mouseY - particle.y
        );
        if (mouseDistance < 100) {
          const angle = Math.atan2(particle.y - mouseY, particle.x - mouseX);
          particle.x += Math.cos(angle) * 0.5;
          particle.y += Math.sin(angle) * 0.5;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${getAccentColorRGB()}, ${opacity})`;
        ctx.fill();
      });

      // Continue animation loop
      animationFrame = requestAnimationFrame(draw);
    }

    // Draw connections between nearby particles
    function drawConnections() {
      ctx.strokeStyle = `rgba(${getAccentColorRGB()}, 0.1)`;
      ctx.beginPath();

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Only draw connection if particles are close enough
          const maxDistance = particles[i].connectDistance;
          if (distance < maxDistance) {
            // Fade out connection as distance increases
            ctx.globalAlpha = 1 - distance / maxDistance;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1; // Reset global alpha
    }

    // Start animation
    function startAnimation() {
      resizeCanvas();
      draw();
    }

    // Clean up function to remove event listeners and cancel animation
    function cleanup() {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    }

    // Set up event listeners
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    // Start the animation
    startAnimation();

    // Add cleanup method to canvas for potential future cleanup
    canvas.cleanup = cleanup;
  }
});
