/**
 * Touch Interaction Helper - Unified mobile touch experience manager
 * Handles both visual feedback and touch-to-click conversion
 */
(function () {
  // Only run on touch devices
  if (!("ontouchstart" in window)) return;

  console.log("Touch interaction helper initialized");

  document.addEventListener("DOMContentLoaded", function () {
    // Elements that need touch-to-click conversion (unified handler)
    const clickableSelectors = [
      "#heroThemeToggle",
      "#themeToggle",
      "#profileThemeToggle",
      ".theme-btn"
    ];

    // Elements that only need visual feedback
    const visualFeedbackSelectors = [
      "button:not(#heroThemeToggle):not(#themeToggle):not(#profileThemeToggle):not(.theme-btn)",
      ".btn",
      ".nav-menu a",
      ".connect-button",
      ".social-icon",
      ".action-btn",
      ".hero-btn"
    ];

    // Handle touch-to-click for specific elements (replaces individual handlers)
    clickableSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        // Only add if not already handled
        if (!element.dataset.touchHandled) {
          element.addEventListener("touchend", function (e) {
            e.preventDefault();
            e.stopPropagation();
            this.click();
          }, { passive: false });

          element.dataset.touchHandled = "true";
        }
      });
    });

    // Add visual feedback (touch-active class) for all interactive elements
    const allTouchElements = document.querySelectorAll(
      visualFeedbackSelectors.join(", ") + ", " + clickableSelectors.join(", ")
    );

    allTouchElements.forEach((element) => {
      element.addEventListener(
        "touchstart",
        function () {
          this.classList.add("touch-active");
        },
        { passive: true }
      );

      element.addEventListener(
        "touchend",
        function () {
          // Small delay to ensure visual feedback is visible
          setTimeout(() => {
            this.classList.remove("touch-active");
          }, 100);
        },
        { passive: true }
      );
    });

    console.log(`Touch handlers registered: ${allTouchElements.length} elements`);
  });
})();
