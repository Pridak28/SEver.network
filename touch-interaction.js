/**
 * Touch Interaction Helper - Improves mobile touch experience
 * Enhanced version with better touch feedback and accessibility
 */
(function () {
  // Only run on touch devices
  if (!("ontouchstart" in window)) return;

  console.log("Touch interaction helper initialized");

  document.addEventListener("DOMContentLoaded", function () {
    // Add touch active state for buttons and interactive elements
    const touchElements = document.querySelectorAll(
      "button, .btn, .hero-btn, .nav-menu a, .connect-button, .social-icon, .action-btn, .card, .feature-card, .token-action"
    );

    touchElements.forEach((element) => {
      // Add active state on touch start
      element.addEventListener(
        "touchstart",
        function () {
          this.classList.add("touch-active");
        },
        { passive: true }
      );

      // Remove active state on touch end
      element.addEventListener(
        "touchend",
        function () {
          this.classList.remove("touch-active");
        },
        { passive: true }
      );

      // Remove active state if touch is cancelled
      element.addEventListener(
        "touchcancel",
        function () {
          this.classList.remove("touch-active");
        },
        { passive: true }
      );
    });

    // Improve scroll performance on mobile
    const scrollElements = document.querySelectorAll(
      ".nav-menu, .blockchain-container, .transaction-list, .timeline-container"
    );

    scrollElements.forEach((element) => {
      element.style.webkitOverflowScrolling = "touch";
    });
  });
})();
