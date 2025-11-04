/**
 * Hero Section Interaction Script
 * Handles theme toggle and other hero section functionality
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("Hero script loading...");
  
  // Hero theme toggle functionality
  const heroThemeToggle = document.getElementById("heroThemeToggle");

  if (heroThemeToggle) {
    console.log("Hero theme toggle found!");
    
    // Remove any existing listeners by cloning the element
    const newToggle = heroThemeToggle.cloneNode(true);
    heroThemeToggle.parentNode.replaceChild(newToggle, heroThemeToggle);
    
    // Add single, clean event listener
    newToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Theme toggle clicked!");
      
      document.body.classList.toggle("light-mode");
      updateThemeIcon();
      
      // Save preference
      const isLightMode = document.body.classList.contains("light-mode");
      localStorage.setItem("theme", isLightMode ? "light" : "dark");
      
      // Sync with main theme toggle if it exists
      const mainThemeToggle = document.getElementById("themeToggle");
      if (mainThemeToggle) {
        const icon = mainThemeToggle.querySelector("i");
        if (icon) {
          icon.className = isLightMode ? "fas fa-moon" : "fas fa-adjust";
        }
      }
    });

    // Also add touch event for mobile
    newToggle.addEventListener("touchend", function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.click();
    });

    // Initialize the button state
    updateThemeIcon();
  } else {
    console.warn("Hero theme toggle not found in DOM");
  }

  // Update theme icon based on current theme
  function updateThemeIcon() {
    const toggle = document.getElementById("heroThemeToggle");
    if (toggle) {
      if (document.body.classList.contains("light-mode")) {
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        toggle.innerHTML = '<i class="fas fa-adjust"></i>';
      }
    }
  }

  // Initialize typing animation effect
  const typingText = document.querySelector(".typing-text");
  if (typingText) {
    // Reset the animation when the element becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = "none";
            setTimeout(() => {
              entry.target.style.animation =
                "typing 3.5s steps(40, end) 1s forwards";
            }, 50);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(typingText);
  }

  // Hero height is controlled by CSS (style.css line 469)
  // Using CSS approach: min-height: calc(100vh - 80px)
  // JavaScript dynamic height adjustment disabled to avoid conflicts
  /*
  const heroSection = document.getElementById("hero");
  if (heroSection) {
    function adjustHeroHeight() {
      const windowHeight = window.innerHeight;
      const navHeight = document.getElementById("navbar")?.offsetHeight || 60;
      heroSection.style.minHeight = `${windowHeight - navHeight}px`;
    }
    adjustHeroHeight();
    window.addEventListener("resize", adjustHeroHeight);
  }
  */

  // Smooth scrolling for hero action buttons
  const heroActionButtons = document.querySelectorAll(".hero-actions a");
  heroActionButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Add interactive effects to blockchain stats
  const blockchainStats = document.querySelectorAll(
    ".hero-stats .blockchain-stat"
  );
  blockchainStats.forEach((stat) => {
    stat.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
    });

    stat.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });

  // Theme selector functionality (color themes)
  const themeButtons = document.querySelectorAll(".theme-btn");

  console.log("Theme buttons found:", themeButtons.length);

  // Set current theme as active on load
  // FIXED: Changed from "themeColor" to "accentColor" to match script-2.js
  const currentTheme = localStorage.getItem("accentColor") || "cyan";
  document.body.classList.add(`theme-${currentTheme}`);
  themeButtons.forEach((button) => {
    if (button.dataset.theme === `theme-${currentTheme}`) {
      button.classList.add("active");
    }
  });

  // Add click event to each theme button
  themeButtons.forEach((button) => {
    // Remove existing listeners by cloning
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    newButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      console.log("Theme button clicked:", this.dataset.theme);

      // Remove all theme classes and active states
      document.querySelectorAll(".theme-btn").forEach((btn) => btn.classList.remove("active"));

      // Remove all theme classes from body
      document.body.classList.remove(
        "theme-neon",
        "theme-purple",
        "theme-blue",
        "theme-red",
        "theme-cyan",
        "theme-white",
        "theme-gold",
        "theme-green",
        "theme-orange",
        "theme-black"
      );

      // Add new theme class and active state
      const newTheme = this.dataset.theme;
      document.body.classList.add(newTheme);
      this.classList.add("active");

      // Store theme preference - FIXED: using "accentColor" instead of "themeColor"
      // Extract just the color name (e.g., "cyan" from "theme-cyan")
      const colorName = newTheme.replace("theme-", "");
      localStorage.setItem("accentColor", colorName);

      console.log("Theme changed to:", newTheme);

      // Trigger background canvas update
      if (window.updateCanvasColors) {
        setTimeout(window.updateCanvasColors, 50);
      }
      
      // Trigger any theme change event
      window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }));
    });
    
    // Mobile touch support
    newButton.addEventListener("touchend", function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.click();
    });
  });
  
  console.log("Hero script loaded successfully!");
});
