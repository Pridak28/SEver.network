// Financial Snapshot Animation Script
// Animates numbers, progress bars, and glows in the snapshot-section

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".snapshot-section");
  if (!section) return;

  // Helper: animate number
  function animateNumber(
    el,
    target,
    duration = 1200,
    prefix = "",
    suffix = "",
    decimals = 2
  ) {
    let start = 0;
    let startTime = null;
    const isCurrency = prefix.includes("€");
    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      let value = start + (target - start) * progress;
      if (isCurrency)
        value = value.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      else value = value.toFixed(decimals);
      el.textContent = `${prefix}${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Helper: animate progress bar
  function animateProgressBar(bar, targetWidth, duration = 1200) {
    bar.style.width = "0%";
    bar.style.transition = "none";
    setTimeout(() => {
      bar.style.transition = `width ${duration}ms cubic-bezier(.4,1.6,.4,1)`;
      bar.style.width = targetWidth;
    }, 50);
  }

  // Helper: fade in cards
  function fadeInCards(cards) {
    cards.forEach((card, i) => {
      card.style.opacity = 0;
      card.style.transform = "translateY(32px)";
      setTimeout(() => {
        card.style.transition =
          "opacity 0.7s cubic-bezier(.4,1.6,.4,1), transform 0.7s cubic-bezier(.4,1.6,.4,1)";
        card.style.opacity = 1;
        card.style.transform = "translateY(0)";
      }, 120 + i * 80);
    });
  }

  // Helper: apply theme glow
  function applyThemeGlow(card) {
    card.style.boxShadow = `0 0 24px 2px var(--accent-color, #00fff7), 0 0 0 2px var(--accent-color, #00fff7) inset`;
    card.style.border = "1.5px solid var(--accent-color, #00fff7)";
    card.style.background = "rgba(15,18,25,0.55)";
    card.style.backdropFilter = "blur(12px)";
    card.style.webkitBackdropFilter = "blur(12px)";
    card.style.transition =
      "box-shadow 0.4s, border-color 0.4s, background 0.4s";
  }

  // Animate on intersection
  let animated = false;
  const observer = new window.IntersectionObserver(
    (entries) => {
      if (animated) return;
      if (entries[0].isIntersecting) {
        animated = true;
        const cards = section.querySelectorAll(".snapshot-card");
        fadeInCards(cards);
        // Animate numbers
        cards.forEach((card) => {
          const valueEl = card.querySelector(".metric-value");
          if (!valueEl) return;
          let raw = valueEl.textContent
            .replace(/[^\d.,-]/g, "")
            .replace(/,/g, ".");
          let prefix = valueEl.textContent.match(/^\D+/)?.[0] || "";
          let suffix = valueEl.textContent.match(/\D+$/)?.[0] || "";
          let decimals = (raw.split(".")[1] || "").length;
          let num = parseFloat(raw.replace(/[^\d.-]/g, ""));
          if (!isNaN(num))
            animateNumber(valueEl, num, 1200, prefix, suffix, decimals);
        });
        // Animate EBITDA progress bar
        const ebitdaBar = section.querySelector(
          ".snapshot-card.ebitda .progress-bar"
        );
        if (ebitdaBar)
          animateProgressBar(
            ebitdaBar,
            ebitdaBar.getAttribute("style").match(/width:\s*(\d+%)/)?.[1] ||
              "90%"
          );
        // Theme glow
        cards.forEach(applyThemeGlow);
      }
    },
    { threshold: 0.3 }
  );
  observer.observe(section);

  // Listen for theme changes
  const themeObserver = new window.MutationObserver(() => {
    section.querySelectorAll(".snapshot-card").forEach(applyThemeGlow);
  });
  themeObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // Financial Flow Animation for snapshot-section
  (function animateFinancialFlow() {
    const flowSection = document.querySelector(
      ".snapshot-section .financial-flow-visualization"
    );
    if (!flowSection) return;

    const nodes = Array.from(
      flowSection.querySelectorAll(".flow-node, .flow-arrow")
    );

    // Helper: fade in element
    function fadeIn(el, delay = 0) {
      el.style.opacity = 0;
      el.style.transform = "translateY(32px)";
      setTimeout(() => {
        el.style.transition =
          "opacity 0.7s cubic-bezier(.4,1.6,.4,1), transform 0.7s cubic-bezier(.4,1.6,.4,1)";
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
      }, delay);
    }

    // Helper: glow effect for arrows
    function glowArrow(arrow) {
      arrow.style.filter = "drop-shadow(0 0 8px var(--accent-color))";
      arrow.style.transition = "filter 0.5s";
      setInterval(() => {
        arrow.style.filter =
          arrow.style.filter === "none"
            ? "drop-shadow(0 0 8px var(--accent-color))"
            : "none";
      }, 900);
    }

    // Animate in sequence
    let delay = 0;
    nodes.forEach((el, i) => {
      fadeIn(el, delay);
      // Animate number if node
      if (el.classList.contains("flow-node")) {
        const valueEl = el.querySelector(".node-value");
        if (valueEl) {
          let raw = valueEl.textContent
            .replace(/[^\d.,-]/g, "")
            .replace(/,/g, ".");
          let prefix = valueEl.textContent.match(/^\D+/)?.[0] || "";
          let suffix = valueEl.textContent.match(/\D+$/)?.[0] || "";
          let decimals = (raw.split(".")[1] || "").length;
          let num = parseFloat(raw.replace(/[^\d.-]/g, ""));
          if (!isNaN(num))
            setTimeout(
              () => animateNumber(valueEl, num, 1200, prefix, suffix, decimals),
              delay + 200
            );
        }
      }
      // Animate arrow glow
      if (el.classList.contains("flow-arrow")) {
        setTimeout(() => glowArrow(el), delay + 200);
      }
      delay += 350;
    });
  })();
});
