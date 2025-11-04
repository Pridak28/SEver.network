// Counter Animation Utility
// Animates elements with class .stat-counter from 0 to a target value
(function () {
  function parseTarget(el) {
    const data = el.getAttribute("data-count");
    if (data != null && data !== "") return Number(data);
    const text = (el.textContent || "").replace(/[^0-9.-]/g, "");
    const n = Number(text);
    return isFinite(n) ? n : 0;
  }

  function format(n) {
    try {
      return new Intl.NumberFormat(undefined).format(n);
    } catch (_) {
      return String(n);
    }
  }

  function animate(el, to, duration = 1600) {
    if (el.__counterAnimated) return;
    el.__counterAnimated = true;
    const start = 0;
    const startTs = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

    function step(ts) {
      const p = Math.min(1, (ts - startTs) / duration);
      const eased = ease(p);
      const val = Math.round(start + (to - start) * eased);
      el.textContent = format(val);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function init() {
    const counters = Array.from(document.querySelectorAll(".stat-counter"));
    if (!counters.length) return;

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              const el = e.target;
              animate(el, parseTarget(el));
              io.unobserve(el);
            }
          }
        },
        { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
      );

      counters.forEach((el) => io.observe(el));
    } else {
      // Fallback: animate immediately
      counters.forEach((el) => animate(el, parseTarget(el)));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
