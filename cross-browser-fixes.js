/**
 * Cross-browser compatibility fixes for theme changes and animations
 */
(function () {
  // Run when DOM is fully loaded
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Initializing cross-browser theme compatibility");

    // Add direct handlers to theme buttons and color options
    function setupDirectThemeHandlers() {
      // Find all possible theme change buttons
      const themeButtons = document.querySelectorAll(
        ".color-option, [data-theme], .theme-btn, #themeToggle"
      );

      if (themeButtons.length > 0) {
        console.log(`Found ${themeButtons.length} theme buttons to monitor`);

        themeButtons.forEach((button) => {
          button.addEventListener("click", function () {
            // Log the theme button click
            console.log("Theme button clicked:", this);

            // Force canvas updates on all browsers with multiple passes
            if (window.updateCanvasColors) {
              // Multiple attempts with increasing delays for different browser timing
              window.updateCanvasColors(true); // Immediate
              setTimeout(() => window.updateCanvasColors(true), 10); // Quick follow-up
              setTimeout(() => window.updateCanvasColors(true), 50); // Medium delay
              setTimeout(() => window.updateCanvasColors(true), 150); // Longer delay
            }
          });
        });
      }
    }

    // Add global function for manual theme updates from console
    window.forceThemeUpdate = function () {
      console.log("Manual theme update triggered");
      if (window.updateCanvasColors) {
        window.updateCanvasColors(true);
      }
    };

    // Browser detection for specific fixes
    const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
    const isChrome =
      /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    console.log("Browser detection:", { isFirefox, isChrome, isSafari });

    // Apply browser-specific fixes
    if (isFirefox) {
      console.log("Applying Firefox-specific fixes");
      // Firefox needs theme changes to be delayed slightly
      const originalUpdateFn = window.updateCanvasColors;
      if (originalUpdateFn) {
        window.updateCanvasColors = function (force) {
          setTimeout(() => originalUpdateFn(force), 20);
        };
      }
    } else if (isChrome) {
      console.log("Applying Chrome-specific fixes");
      // Chrome needs multiple update attempts
      document
        .querySelectorAll(".color-option, [data-theme]")
        .forEach((btn) => {
          btn.addEventListener("click", function () {
            setTimeout(() => {
              const canvas = document.getElementById("bgCanvas");
              if (canvas) {
                // Force repaint by toggling display
                const originalDisplay = canvas.style.display;
                canvas.style.display = "none";
                void canvas.offsetHeight;
                canvas.style.display = originalDisplay;
              }
            }, 30);
          });
        });
    }

    // Setup theme handlers after a short delay to ensure DOM is ready
    setTimeout(setupDirectThemeHandlers, 100);
  });

  // Add script to detect when blockchain resources are loaded
  document.addEventListener("DOMContentLoaded", function () {
    // Initialize with fallbacks for better cross-browser support
    initWithFallbacks();
  });

  function initWithFallbacks() {
    // Track loading state
    let ethersLoaded = false;

    // Check if Ethers.js is needed (only if we have blockchain elements)
    const needsEthers =
      document.getElementById("walletInfo") ||
      document.getElementById("blockchainTransactions") ||
      document.querySelector(".navbar-connect") ||
      document.querySelector(".connect-button");

    if (!needsEthers) {
      console.log("Blockchain functionality not needed on this page");
      return;
    }

    // Try to load ethers.js with multiple fallback options
    loadEthersWithFallbacks()
      .then(() => {
        console.log("Ethers.js loaded successfully");
        ethersLoaded = true;
        initBlockchainFunctionality();
      })
      .catch((err) => {
        console.warn("Could not load Ethers.js - using fallback mode:", err);
        initBlockchainFallback();
      });

    // Add fallback for THREE.js for blockchain explorer
    if (
      typeof THREE === "undefined" &&
      document.getElementById("blockchain3DContainer")
    ) {
      console.log(
        "THREE.js not available, using 2D fallback for blockchain visualization"
      );
      const blockchainContainer = document.getElementById(
        "blockchain3DContainer"
      );
      if (blockchainContainer) {
        blockchainContainer.innerHTML = `
          <div class="blockchain-2d-fallback">
            <div class="block-chain">
              <div class="block active">Block 1</div>
              <div class="block">Block 2</div>
              <div class="block">Block 3</div>
            </div>
            <p class="fallback-note">2D visualization mode</p>
          </div>
        `;
        blockchainContainer.style.display = "flex";
        blockchainContainer.style.alignItems = "center";
        blockchainContainer.style.justifyContent = "center";
      }
    }

    // Initialize other components with error handling
    try {
      // Initialize login functions if on login page
      if (document.querySelector(".login-page")) {
        setupLoginHandlers();
      }

      // Initialize wallet functionality if on wallet page
      if (document.getElementById("walletInfo")) {
        setupWalletInterface();
      }
    } catch (error) {
      console.error("Error during initialization:", error);
    }
  }

  // Enhanced script loading with multiple fallbacks
  function loadEthersWithFallbacks() {
    const ethersUrls = [
      "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js",
      "https://unpkg.com/ethers@5.7.2/dist/ethers.umd.min.js",
      "https://cdn.ethers.io/lib/ethers-5.7.umd.min.js",
    ];

    return tryLoadFromUrls(ethersUrls);
  }

  function tryLoadFromUrls(urls, index = 0) {
    if (index >= urls.length) {
      return Promise.reject(new Error("All CDN sources failed"));
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = urls[index];
      script.onload = () => {
        if (typeof ethers !== "undefined") {
          resolve();
        } else {
          tryLoadFromUrls(urls, index + 1)
            .then(resolve)
            .catch(reject);
        }
      };
      script.onerror = () => {
        console.warn(`Failed to load from ${urls[index]}, trying next...`);
        tryLoadFromUrls(urls, index + 1)
          .then(resolve)
          .catch(reject);
      };
      document.head.appendChild(script);
    });
  }

  // Initialize blockchain fallback mode
  function initBlockchainFallback() {
    console.log("Initializing blockchain fallback mode");

    // Mock blockchain functionality for demonstration
    window.mockBlockchain = {
      isConnected: false,
      account: null,
      balance: "0.0000",

      connect: async function () {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.isConnected = true;
            this.account = "0x" + Math.random().toString(16).substring(2, 42);
            this.balance = (Math.random() * 10).toFixed(4);
            resolve({ account: this.account, balance: this.balance });
          }, 1000);
        });
      },

      getBalance: function () {
        return Promise.resolve(this.balance + " ETH");
      },
    };

    // Update connect buttons to show demo mode
    const connectButtons = document.querySelectorAll(
      ".connect-button, .navbar-connect"
    );
    connectButtons.forEach((button) => {
      if (button) {
        button.textContent = button.textContent + " (Demo)";
        button.addEventListener("click", handleDemoConnect);
      }
    });
  }

  // Handle demo wallet connection
  async function handleDemoConnect(e) {
    e.preventDefault();
    const button = e.target;
    const originalText = button.textContent;

    try {
      button.textContent = "Connecting...";
      button.disabled = true;

      const result = await window.mockBlockchain.connect();

      // Show success message
      showMessage(
        `Demo wallet connected! Address: ${result.account.substring(0, 8)}...`,
        true
      );

      // Update button
      button.textContent = "Connected (Demo)";
      button.style.background = "var(--accent-color)";
      button.style.color = "#000";
    } catch (error) {
      console.error("Demo connection error:", error);
      showMessage("Demo connection failed");
      button.textContent = originalText;
      button.disabled = false;
    }
  }

  // Helper for script loading with fallbacks
  function loadScript(src, fallbackSrc) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = () => {
        console.warn(`Failed to load ${src}, trying fallback...`);
        if (fallbackSrc) {
          const fallbackScript = document.createElement("script");
          fallbackScript.src = fallbackSrc;
          fallbackScript.onload = resolve;
          fallbackScript.onerror = reject;
          document.head.appendChild(fallbackScript);
        } else {
          reject(new Error(`Failed to load script: ${src}`));
        }
      };
      document.head.appendChild(script);
    });
  }

  // Setup login functionality
  function setupLoginHandlers() {
    const loginForm = document.getElementById("loginForm");
    const createAccountBtn = document.getElementById("createAccountBtn");
    const connectMetamaskBtn = document.getElementById("connectMetamask");

    if (loginForm) {
      loginForm.addEventListener("submit", handleLogin);
    }

    if (createAccountBtn) {
      createAccountBtn.addEventListener("click", toggleCreateAccount);
    }

    if (connectMetamaskBtn) {
      connectMetamaskBtn.addEventListener("click", connectWithMetamask);
    }

    // Check if already logged in
    const storedUser = sessionStorage.getItem("walletUser");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && (userData.username || userData.address)) {
          showMessage("You are already logged in! Redirecting...", true);
          setTimeout(() => {
            window.location.href = "blockchain-s/wallet.html";
          }, 1500);
        }
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        sessionStorage.removeItem("walletUser");
      }
    }
  }

  // Handle login form submission
  async function handleLogin(e) {
    e.preventDefault();
    const errorMsg = document.getElementById("errorMessage");
    errorMsg.textContent = "";

    try {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const invitationCode =
        document.getElementById("invitationCode")?.value || "";

      // Visual feedback
      const loginBtn = document.getElementById("loginBtn");
      const originalText = loginBtn.textContent;
      loginBtn.textContent = "Connecting...";
      loginBtn.disabled = true;

      // Determine if this is login or registration
      const isRegistration = loginBtn.textContent.includes("Register");
      const endpoint = isRegistration ? "/register" : "/login";

      // API call
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, code: invitationCode }),
      });

      if (!response.ok) {
        // Try to get error message from response
        try {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              `${isRegistration ? "Registration" : "Login"} failed`
          );
        } catch (jsonError) {
          throw new Error(
            `${isRegistration ? "Registration" : "Login"} failed: ${
              response.status
            }`
          );
        }
      }

      const data = await response.json();

      // Store user data
      sessionStorage.setItem("walletUser", JSON.stringify(data));

      // Success message
      showMessage(
        `${
          isRegistration ? "Account created" : "Login successful"
        }! Redirecting...`,
        true
      );

      // Redirect
      setTimeout(() => {
        window.location.href = "blockchain-s/wallet.html";
      }, 1500);
    } catch (error) {
      console.error(
        `${
          loginBtn.textContent.includes("Register") ? "Registration" : "Login"
        } error:`,
        error
      );
      showMessage(error.message);

      // Reset button
      loginBtn.textContent = originalText;
      loginBtn.disabled = false;
    }
  }

  // Toggle between login and create account
  function toggleCreateAccount() {
    const form = document.getElementById("loginForm");
    const title = document.querySelector(".glitch-title");
    const loginBtn = document.getElementById("loginBtn");
    const createBtn = document.getElementById("createAccountBtn");

    if (title.textContent === "Access Terminal") {
      // Switch to registration mode
      title.textContent = "Create Account";
      title.setAttribute("data-text", "Create Account");
      loginBtn.textContent = "Register";
      createBtn.textContent = "Back to Login";

      // Make invitation code field more prominent
      const invitationField = document.querySelector(
        ".form-group:nth-child(3)"
      );
      if (invitationField) {
        invitationField.style.display = "block";
        const optionalText = invitationField.querySelector(".optional");
        if (optionalText) optionalText.style.display = "none";
      }
    } else {
      // Switch back to login mode
      title.textContent = "Access Terminal";
      title.setAttribute("data-text", "Access Terminal");
      loginBtn.textContent = "Login";
      createBtn.textContent = "Create Account";

      // Make invitation code optional again
      const invitationField = document.querySelector(
        ".form-group:nth-child(3)"
      );
      if (invitationField) {
        const optionalText = invitationField.querySelector(".optional");
        if (optionalText) optionalText.style.display = "inline";
      }
    }
  }

  // Connect with MetaMask
  async function connectWithMetamask() {
    const errorMsg = document.getElementById("errorMessage");
    errorMsg.textContent = "";
    const button = document.getElementById("connectMetamask");

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        throw new Error(
          "MetaMask is not installed. Please install MetaMask to continue."
        );
      }

      // Show connecting status
      button.textContent = "Connecting...";
      button.disabled = true;

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      if (!account) {
        throw new Error(
          "No account found. Please check MetaMask and try again."
        );
      }

      // Get chain ID
      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      // Prepare user data
      const userData = {
        address: account,
        authMethod: "metamask",
        chainId: chainId,
        username: `metamask_${account.substring(2, 8)}`,
      };

      // Store in session
      sessionStorage.setItem("walletUser", JSON.stringify(userData));

      // Show success message
      showMessage("Connected with MetaMask! Redirecting...", true);

      // Redirect to wallet page
      setTimeout(() => {
        window.location.href = "blockchain-s/wallet.html";
      }, 1500);
    } catch (error) {
      console.error("MetaMask connection error:", error);
      showMessage(error.message);

      // Reset button
      button.textContent = "🦊 Connect Metamask";
      button.disabled = false;
    }
  }

  // Show message (error or success)
  function showMessage(message, isSuccess = false) {
    const messageElement = document.getElementById("errorMessage");
    if (messageElement) {
      messageElement.textContent = message;
      messageElement.style.color = isSuccess
        ? "var(--accent-color)"
        : "#ff3860";
      messageElement.style.display = "block";
    }
  }

  // Show blockchain-specific error messages
  function showBlockchainError(message) {
    // Create error container if it doesn't exist
    let errorContainer = document.getElementById("blockchainErrorMessage");
    if (!errorContainer) {
      errorContainer = document.createElement("div");
      errorContainer.id = "blockchainErrorMessage";
      errorContainer.className = "fallback-message";
      errorContainer.style.position = "fixed";
      errorContainer.style.bottom = "20px";
      errorContainer.style.right = "20px";
      errorContainer.style.zIndex = "9999";
      errorContainer.style.maxWidth = "300px";
      document.body.appendChild(errorContainer);
    }

    errorContainer.textContent = message;
    errorContainer.style.display = "block";

    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorContainer.style.display = "none";
    }, 5000);
  }

  // Initialize blockchain functionality when ethers.js is loaded
  function initBlockchainFunctionality() {
    // Check if we're on a page that needs blockchain features
    const needsBlockchain =
      document.getElementById("walletInfo") ||
      document.getElementById("blockchainTransactions") ||
      document.querySelector(".navbar-connect");

    if (!needsBlockchain) return;

    try {
      // Initialize provider
      let provider;
      if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
      } else {
        // Fallback to a JSON-RPC provider
        provider = new ethers.providers.JsonRpcProvider(
          "https://eth-mainnet.g.alchemy.com/v2/demo"
        );
      }

      // Store provider for later use
      window.ethProvider = provider;

      console.log("Blockchain functionality initialized");
    } catch (error) {
      console.error("Failed to initialize blockchain functionality:", error);
      showBlockchainError("Blockchain functionality limited: " + error.message);
    }
  }

  // Setup wallet interface
  function setupWalletInterface() {
    // Check if user is logged in
    const userData = JSON.parse(sessionStorage.getItem("walletUser") || "{}");
    if (!userData.username && !userData.address) {
      // Redirect to login if not authenticated
      window.location.href = "../login.html";
      return;
    }

    // Display wallet info
    const walletInfo = document.getElementById("walletInfo");
    if (walletInfo) {
      const addressDisplay = document.createElement("div");
      addressDisplay.className = "wallet-address";
      addressDisplay.textContent = userData.address || "No wallet connected";
      walletInfo.appendChild(addressDisplay);

      const balanceDisplay = document.createElement("div");
      balanceDisplay.className = "wallet-balance";
      balanceDisplay.textContent = "Loading balance...";
      walletInfo.appendChild(balanceDisplay);

      // Fetch and display balance if address is available
      if (userData.address && window.ethProvider) {
        window.ethProvider
          .getBalance(userData.address)
          .then((balance) => {
            const etherBalance = ethers.utils.formatEther(balance);
            balanceDisplay.textContent = `Balance: ${parseFloat(
              etherBalance
            ).toFixed(4)} ETH`;
          })
          .catch((error) => {
            console.error("Error fetching balance:", error);
            balanceDisplay.textContent = "Balance unavailable";
          });
      }
    }
  }
})();

/**
 * Cross-Browser Compatibility Fixes
 * Handles compatibility issues across different browsers and devices
 */

(function () {
  "use strict";

  // Browser detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

  console.log("Cross-browser fixes loaded for:", { isIOS, isSafari, isMobile });

  // Fix 1: CSS Variable Support for Older Browsers
  function fixCSSVariables() {
    if (
      !window.CSS ||
      !window.CSS.supports ||
      !window.CSS.supports("color", "var(--fake-var)")
    ) {
      const style = document.createElement("style");
      style.textContent = `
                :root {
                    --accent-color: #00ffff;
                    --bg-color: #000000;
                    --text-color: #ffffff;
                }
                .theme-neon { --accent-color: #0cff53; }
                .theme-purple { --accent-color: #cc00ff; }
                .theme-blue { --accent-color: #0055ff; }
                .theme-red { --accent-color: #ff0055; }
                .theme-white { --accent-color: #ffffff; }
                .theme-gold { --accent-color: #ffd700; }
            `;
      document.head.appendChild(style);
    }
  }

  // Fix 2: Intersection Observer Polyfill
  function fixIntersectionObserver() {
    if (!window.IntersectionObserver) {
      // Simple fallback for intersection observer
      window.IntersectionObserver = function (callback) {
        return {
          observe: function (element) {
            // Simple visibility check
            const checkVisibility = () => {
              const rect = element.getBoundingClientRect();
              const isVisible =
                rect.top < window.innerHeight && rect.bottom > 0;
              if (isVisible) {
                callback([{ isIntersecting: true, target: element }]);
              }
            };

            window.addEventListener("scroll", checkVisibility);
            window.addEventListener("resize", checkVisibility);
            checkVisibility(); // Initial check
          },
          disconnect: function () {},
        };
      };
    }
  }

  // Fix 3: requestAnimationFrame Polyfill
  function fixRequestAnimationFrame() {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        return setTimeout(callback, 1000 / 60);
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }
  }

  // Fix 4: iOS Safari Specific Fixes
  function fixiOSSafari() {
    if (isIOS || isSafari) {
      // Fix viewport height issues
      function setVHUnit() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
      }

      setVHUnit();
      window.addEventListener("resize", setVHUnit);
      window.addEventListener("orientationchange", setVHUnit);

      // Fix touch scrolling
      document.body.style.webkitOverflowScrolling = "touch";

      // Prevent zoom on form focus
      const meta = document.querySelector('meta[name="viewport"]');
      if (meta) {
        meta.content =
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      }
    }
  }

  // Fix 5: Canvas Context Issues
  function fixCanvasContext() {
    // Add fallback for canvas context issues
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, attributes) {
      try {
        return originalGetContext.call(this, type, attributes);
      } catch (e) {
        console.warn("Canvas context creation failed, using fallback");
        return null;
      }
    };
  }

  // Fix 6: Touch Event Handling
  function fixTouchEvents() {
    if (isMobile) {
      // Add touch feedback
      const style = document.createElement("style");
      style.textContent = `
                .touch-active {
                    opacity: 0.7;
                    transform: scale(0.95);
                    transition: all 0.1s ease;
                }
                
                button:active, a:active {
                    opacity: 0.7;
                    transform: scale(0.95);
                }
                
                /* Improve touch targets */
                button, a, [role="button"] {
                    min-height: 44px;
                    min-width: 44px;
                    position: relative;
                }
                
                /* Fix sticky hover states on mobile */
                @media (hover: none) {
                    button:hover, a:hover {
                        opacity: 1;
                        transform: none;
                    }
                }
            `;
      document.head.appendChild(style);

      // Prevent double-tap zoom
      let lastTouchEnd = 0;
      document.addEventListener(
        "touchend",
        function (event) {
          const now = new Date().getTime();
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        },
        false
      );
    }
  }

  // Fix 7: Animation Performance
  function optimizeAnimations() {
    // Reduce animations on low-end devices
    const isLowEnd =
      navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

    if (isLowEnd || isMobile) {
      const style = document.createElement("style");
      style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.1s !important;
                    animation-delay: 0s !important;
                    transition-duration: 0.1s !important;
                    transition-delay: 0s !important;
                }
                
                .particle, .loading-particle {
                    display: none;
                }
            `;
      document.head.appendChild(style);
    }
  }

  // Fix 8: Memory Management
  function improveMemoryManagement() {
    // Clean up event listeners when navigating away
    window.addEventListener("beforeunload", function () {
      // Clear intervals and timeouts
      const highestTimeoutId = setTimeout(function () {}, 0);
      for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
      }

      const highestIntervalId = setInterval(function () {}, 0);
      for (let i = 0; i < highestIntervalId; i++) {
        clearInterval(i);
      }
    });
  }

  // Fix 9: Network Error Handling
  function handleNetworkErrors() {
    // Add error handlers for failed resource loads
    window.addEventListener(
      "error",
      function (e) {
        if (e.target !== window) {
          const element = e.target;
          if (element.tagName === "SCRIPT" && element.src.includes("cdn")) {
            console.warn("CDN resource failed to load:", element.src);
            // Could implement fallback loading here
          }
        }
      },
      true
    );
  }

  // Fix 10: Smooth Scrolling Polyfill
  function addSmoothScrollPolyfill() {
    if (!("scrollBehavior" in document.documentElement.style)) {
      // Simple smooth scroll polyfill
      const originalScrollTo = window.scrollTo;
      window.scrollTo = function (options) {
        if (typeof options === "object" && options.behavior === "smooth") {
          const start = window.pageYOffset;
          const end = options.top;
          const duration = 500;
          const startTime = performance.now();

          function animateScroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeInOutCubic =
              progress < 0.5
                ? 4 * progress * progress * progress
                : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;

            window.scrollTo(0, start + (end - start) * easeInOutCubic);

            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            }
          }

          requestAnimationFrame(animateScroll);
        } else {
          originalScrollTo.apply(window, arguments);
        }
      };
    }
  }

  // Initialize all fixes
  function initializeCrossBrowserFixes() {
    console.log("Applying cross-browser compatibility fixes...");

    fixCSSVariables();
    fixIntersectionObserver();
    fixRequestAnimationFrame();
    fixiOSSafari();
    fixCanvasContext();
    fixTouchEvents();
    optimizeAnimations();
    improveMemoryManagement();
    handleNetworkErrors();
    addSmoothScrollPolyfill();

    console.log("Cross-browser fixes applied successfully");
  }

  // Apply fixes immediately
  initializeCrossBrowserFixes();
})();
