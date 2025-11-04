/**
 * Performance Optimization Script
 * Final optimizations to ensure smooth operation across all devices
 */

(function () {
  "use strict";

  console.log("Performance optimization script loaded");

  // Performance monitoring
  const performanceMetrics = {
    startTime: performance.now(),
    loadTime: 0,
    interactionTime: 0,
    errorCount: 0,
  };

  // Optimization 1: Lazy load non-critical resources
  function optimizeResourceLoading() {
    // Defer heavy animations until after initial load
    setTimeout(() => {
      if (window.bgAnimation && typeof window.bgAnimation.init === "function") {
        window.bgAnimation.init();
      }
    }, 2000);

    // Preload critical images
    const criticalImages = [
      // Add any critical image paths here
    ];

    criticalImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  // Optimization 2: Debounce scroll and resize events
  function optimizeEventHandlers() {
    let scrollTimeout;
    let resizeTimeout;

    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (
      type,
      listener,
      options
    ) {
      if (type === "scroll" || type === "resize") {
        const debouncedListener = function (event) {
          const timeout = type === "scroll" ? scrollTimeout : resizeTimeout;
          clearTimeout(timeout);

          if (type === "scroll") {
            scrollTimeout = setTimeout(() => listener(event), 10);
          } else {
            resizeTimeout = setTimeout(() => listener(event), 100);
          }
        };

        return originalAddEventListener.call(
          this,
          type,
          debouncedListener,
          options
        );
      } else {
        return originalAddEventListener.call(this, type, listener, options);
      }
    };
  }

  // Optimization 3: Reduce animation complexity on low-end devices
  function optimizeAnimations() {
    const isLowEnd =
      navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const isOldBrowser = !window.requestIdleCallback;

    if (isLowEnd || isOldBrowser) {
      const style = document.createElement("style");
      style.textContent = `
                * {
                    animation-duration: 0.2s !important;
                    transition-duration: 0.2s !important;
                }
                
                .particle-animation,
                .complex-animation {
                    display: none !important;
                }
            `;
      document.head.appendChild(style);
    }
  }

  // Optimization 4: Memory leak prevention
  function preventMemoryLeaks() {
    // Clean up intervals and timeouts on page unload
    const intervals = [];
    const timeouts = [];

    const originalSetInterval = window.setInterval;
    const originalSetTimeout = window.setTimeout;

    window.setInterval = function (fn, delay) {
      const id = originalSetInterval(fn, delay);
      intervals.push(id);
      return id;
    };

    window.setTimeout = function (fn, delay) {
      const id = originalSetTimeout(fn, delay);
      timeouts.push(id);
      return id;
    };

    window.addEventListener("beforeunload", () => {
      intervals.forEach(clearInterval);
      timeouts.forEach(clearTimeout);
    });
  }

  // Optimization 5: Chart.js performance improvements
  function optimizeCharts() {
    if (typeof Chart !== "undefined") {
      Chart.defaults.animation.duration = 400; // Faster animations
      Chart.defaults.responsive = true;
      Chart.defaults.maintainAspectRatio = false;
    }
  }

  // Optimization 6: Touch interaction improvements
  function optimizeTouchInteractions() {
    if ("ontouchstart" in window) {
      document.addEventListener("touchstart", function () {}, {
        passive: true,
      });
      document.addEventListener("touchmove", function () {}, { passive: true });
    }
  }

  // Optimization 7: Progressive enhancement
  function applyProgressiveEnhancement() {
    // Check for modern browser features
    const hasModernFeatures =
      "IntersectionObserver" in window &&
      "requestIdleCallback" in window &&
      "fetch" in window;

    if (!hasModernFeatures) {
      console.log("Applying fallbacks for older browser");

      // Disable complex features
      const advancedSections = document.querySelectorAll(
        '[id*="3D"], [id*="blockchain"], [class*="advanced"]'
      );

      advancedSections.forEach((section) => {
        const fallback = document.createElement("div");
        fallback.className = "feature-fallback";
        fallback.innerHTML = `
                    <p>This feature requires a modern browser.</p>
                    <p>Please update your browser for the best experience.</p>
                `;
        section.appendChild(fallback);
      });
    }
  }

  // Optimization 8: Loading prioritization
  function prioritizeLoading() {
    // Mark critical resources as high priority
    const criticalResources = document.querySelectorAll(
      'link[rel="stylesheet"], script[src*="emergency-fix"], script[src*="cross-browser"]'
    );

    criticalResources.forEach((resource) => {
      if (resource.tagName === "LINK") {
        resource.setAttribute("importance", "high");
      }
    });
  }

  // Optimization 9: Error resilience
  function improveErrorResilience() {
    window.addEventListener("error", function (event) {
      performanceMetrics.errorCount++;

      // Log error for debugging but don't break the experience
      console.warn("Non-critical error occurred:", event.error);

      // Continue execution
      return true;
    });

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", function (event) {
      console.warn("Unhandled promise rejection:", event.reason);
      event.preventDefault(); // Prevent browser error display
    });
  }

  // Optimization 10: Performance monitoring
  function monitorPerformance() {
    // Record load completion time
    window.addEventListener("load", () => {
      performanceMetrics.loadTime =
        performance.now() - performanceMetrics.startTime;
      console.log(`Page loaded in ${performanceMetrics.loadTime.toFixed(2)}ms`);
    });

    // Record first interaction time
    let interactionRecorded = false;
    ["click", "touchstart", "keydown"].forEach((eventType) => {
      document.addEventListener(
        eventType,
        () => {
          if (!interactionRecorded) {
            performanceMetrics.interactionTime =
              performance.now() - performanceMetrics.startTime;
            console.log(
              `First interaction at ${performanceMetrics.interactionTime.toFixed(
                2
              )}ms`
            );
            interactionRecorded = true;
          }
        },
        { once: true, passive: true }
      );
    });

    // Report performance metrics periodically
    setInterval(() => {
      if (performanceMetrics.errorCount > 0) {
        console.log(
          `Performance summary: ${performanceMetrics.errorCount} errors encountered`
        );
      }
    }, 30000); // Every 30 seconds
  }

  // Initialize all optimizations
  function initializeOptimizations() {
    console.log("Applying performance optimizations...");

    optimizeResourceLoading();
    optimizeEventHandlers();
    optimizeAnimations();
    preventMemoryLeaks();
    optimizeCharts();
    optimizeTouchInteractions();
    applyProgressiveEnhancement();
    prioritizeLoading();
    improveErrorResilience();
    monitorPerformance();

    console.log("Performance optimizations completed");
  }

  // Apply optimizations when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeOptimizations);
  } else {
    initializeOptimizations();
  }

  // Expose performance metrics for debugging
  window.getPerformanceMetrics = () => performanceMetrics;
})();
