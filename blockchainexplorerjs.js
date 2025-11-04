/* ===== Blockchain 3D Explorer ===== */
// Initialize the 3D blockchain explorer
function initializeBlockchainExplorer() {
  console.log("Initializing blockchain explorer...");

  const container = document.getElementById("blockchain3DContainer");
  if (!container) {
    console.error("Blockchain container element not found");
    return;
  }

  // Clear any existing content
  container.innerHTML = '';

  // Ensure container has dimensions
  if (container.clientWidth === 0 || container.clientHeight === 0) {
    console.warn("Container has no dimensions, setting defaults");
    container.style.width = '100%';
    container.style.height = '500px';
  }

  console.log(`Container dimensions: ${container.clientWidth}x${container.clientHeight}`);

  // Check WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    console.error("WebGL not supported");
    container.innerHTML = '<div style="color: var(--accent-color); padding: 20px; text-align: center;">WebGL is not supported on this device. The 3D visualization cannot be displayed.</div>';
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 100);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Get accent color for blocks
  function getAccentColor() {
    // Default to cyan if no theme is set
    let color = new THREE.Color(0x00ffff);

    // Check the current theme
    if (document.body.classList.contains("theme-green")) {
      color = new THREE.Color(0x00ff00);
    } else if (document.body.classList.contains("theme-purple")) {
      color = new THREE.Color(0xcc00ff);
    } else if (document.body.classList.contains("theme-orange")) {
      color = new THREE.Color(0xff7700);
    }

    return color;
  }

  // Create block objects
  const blocks = [];
  const blockCount = 30;
  const blockMaterials = {
    normal: new THREE.MeshPhongMaterial({
      color: getAccentColor(),
      transparent: true,
      opacity: 0.7,
      wireframe: false,
    }),
    highlighted: new THREE.MeshPhongMaterial({
      color: getAccentColor(),
      emissive: getAccentColor(),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.9,
    }),
    transaction: new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    }),
  };

  // Create the blockchain geometry
  function createBlockchain() {
    // Clear existing blocks
    blocks.forEach((block) => scene.remove(block.mesh));
    blocks.length = 0;

    // Create blocks
    for (let i = 0; i < blockCount; i++) {
      // Block geometry
      const geometry = new THREE.BoxGeometry(10, 5, 3);
      const mesh = new THREE.Mesh(geometry, blockMaterials.normal);

      // Position blocks in a spiral pattern
      const angle = i * 0.4;
      const radius = 20 + i * 0.8;
      mesh.position.x = radius * Math.cos(angle);
      mesh.position.y = radius * Math.sin(angle);
      mesh.position.z = -i * 1.5;

      // Rotate blocks for better perspective
      mesh.rotation.x = Math.PI * 0.05;
      mesh.rotation.y = angle;

      scene.add(mesh);

      // Store block data
      blocks.push({
        mesh: mesh,
        id: 3487621 - i,
        transactions: Math.floor(Math.random() * 50) + 10,
        timestamp: new Date(Date.now() - i * 120000).toISOString(),
        size: (Math.random() * 1.5 + 0.5).toFixed(2),
        energyVolume: Math.floor(Math.random() * 500) + 100,
        hash:
          "0x" +
          [...Array(40)]
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join(""),
      });

      // Add transaction links between blocks
      if (i > 0) {
        const txCount = Math.min(3, Math.floor(Math.random() * 5) + 1);
        for (let t = 0; t < txCount; t++) {
          const txGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
          const txMesh = new THREE.Mesh(txGeometry, blockMaterials.transaction);

          // Position the transaction link between the current block and a previous one
          const prevIdx = Math.max(0, i - Math.floor(Math.random() * 3) - 1);

          // Calculate midpoint and direction
          const start = mesh.position.clone();
          const end = blocks[prevIdx].mesh.position.clone();
          const direction = end.clone().sub(start);
          const center = start
            .clone()
            .add(direction.clone().multiplyScalar(0.5));

          // Apply a slight curve to the transaction path
          center.y += (Math.random() - 0.5) * 5;
          center.x += (Math.random() - 0.5) * 5;

          // Position and scale the transaction link
          txMesh.position.copy(center);
          txMesh.scale.y = direction.length() - 2; // Subtract block size
          txMesh.lookAt(end);
          txMesh.rotateX(Math.PI / 2);

          scene.add(txMesh);
        }
      }
    }

    // Update block info panel with the most recent block
    updateBlockInfoPanel(blocks[0]);
  }

  // Update block info panel
  function updateBlockInfoPanel(block) {
    const panel = document.getElementById("blockInfoPanel");
    if (!panel) return;

    // Update block info
    panel.querySelector("h3").textContent = `Block #${block.id}`;
    panel.querySelectorAll(
      ".info-value"
    )[0].textContent = `${block.hash.substring(0, 24)}...`;
    panel.querySelectorAll(".info-value")[1].textContent = `${new Date(
      block.timestamp
    ).toLocaleString()} UTC`;
    panel.querySelectorAll(".info-value")[2].textContent = `${block.size} MB`;
    panel.querySelectorAll(".info-value")[3].textContent = block.transactions;
    panel.querySelectorAll(
      ".info-value"
    )[4].textContent = `${block.energyVolume} kWh`;
  }

  // Handle block selection
  function selectBlock(event) {
    // Calculate mouse position
    const rect = container.getBoundingClientRect();
    const mouseX =
      ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    const mouseY =
      -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    // Create a raycaster
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector3(mouseX, mouseY, 0.5);
    raycaster.setFromCamera(mouseVector, camera);

    // Get intersected objects
    const intersects = raycaster.intersectObjects(blocks.map((b) => b.mesh));

    // Reset materials first
    blocks.forEach((block) => {
      block.mesh.material = blockMaterials.normal;
    });

    if (intersects.length > 0) {
      // Highlight selected block
      const selectedMesh = intersects[0].object;
      selectedMesh.material = blockMaterials.highlighted;

      // Find the block data and update info panel
      const selectedBlock = blocks.find((b) => b.mesh === selectedMesh);
      if (selectedBlock) {
        updateBlockInfoPanel(selectedBlock);

        // Show the info panel
        const infoPanel = document.getElementById("blockInfoPanel");
        if (infoPanel) {
          infoPanel.style.display = "block";
        }
      }
    }
  }

  // Handle window resize
  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  // Create blockchain on initialization
  createBlockchain();

  // Add event listeners
  container.addEventListener("click", selectBlock);
  window.addEventListener("resize", onWindowResize);

  // Controls for zoom buttons
  const zoomInBtn = document.getElementById("zoomIn");
  const zoomOutBtn = document.getElementById("zoomOut");
  const resetViewBtn = document.getElementById("resetView");

  if (zoomInBtn) {
    zoomInBtn.addEventListener("click", () => {
      camera.position.z -= 10;
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener("click", () => {
      camera.position.z += 10;
    });
  }

  if (resetViewBtn) {
    resetViewBtn.addEventListener("click", () => {
      camera.position.set(0, 0, 100);
      camera.rotation.set(0, 0, 0);
    });
  }

  // Handle visualization mode changes
  const visualizationModeSelect = document.getElementById("visualizationMode");
  if (visualizationModeSelect) {
    visualizationModeSelect.addEventListener("change", function () {
      const mode = this.value;

      // Update block materials based on visualization mode
      blocks.forEach((block) => {
        switch (mode) {
          case "network":
            block.mesh.material = new THREE.MeshPhongMaterial({
              color: getAccentColor(),
              wireframe: true,
              transparent: true,
              opacity: 0.7,
            });
            break;
          case "energy":
            const energyRatio = block.energyVolume / 500; // Normalize to 0-1 scale
            block.mesh.material = new THREE.MeshPhongMaterial({
              color: new THREE.Color().setHSL(0.3 * energyRatio, 1, 0.5), // Green to yellow to red
              transparent: true,
              opacity: 0.7,
            });
            break;
          default: // 'blocks'
            block.mesh.material = blockMaterials.normal;
        }
      });
    });
  }

  // Handle time range slider
  const timeRangeSlider = document.getElementById("timeRangeSlider");
  const timeRangeValue = document.getElementById("timeRangeValue");

  if (timeRangeSlider && timeRangeValue) {
    timeRangeSlider.addEventListener("input", function () {
      const value = this.value;
      timeRangeValue.textContent = `Last ${value} Blocks`;

      // Show/hide blocks based on slider value
      blocks.forEach((block, index) => {
        block.mesh.visible = index < value;
      });
    });
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Slowly rotate the entire scene
    scene.rotation.y += 0.001;

    // Add some gentle floating motion
    blocks.forEach((block, i) => {
      block.mesh.position.y += Math.sin(Date.now() * 0.001 + i * 0.1) * 0.01;
    });

    renderer.render(scene, camera);
  }

  // Start animation
  animate();

  // Update theme colors when theme changes
  const observer = new MutationObserver(() => {
    // Update materials when theme changes
    blockMaterials.normal.color = getAccentColor();
    blockMaterials.highlighted.color = getAccentColor();
    blockMaterials.highlighted.emissive = getAccentColor();
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return {
    scene,
    camera,
    renderer,
    container,
  };
}

// Initialize blockchain explorer when document is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize blockchain explorer with retry mechanism
  function tryInitBlockchainExplorer(attempts = 0, maxAttempts = 10) {
    // Check if THREE.js is loaded
    if (typeof THREE !== "undefined" && typeof THREE.Scene !== "undefined") {
      const container = document.getElementById("blockchain3DContainer");
      if (container) {
        try {
          initializeBlockchainExplorer();
          console.log("Blockchain explorer initialized successfully");
        } catch (error) {
          console.error("Error initializing blockchain explorer:", error);
        }
      }
    } else if (attempts < maxAttempts) {
      // Retry after 500ms if THREE.js not yet loaded
      console.log(`Waiting for THREE.js to load... (attempt ${attempts + 1}/${maxAttempts})`);
      setTimeout(() => tryInitBlockchainExplorer(attempts + 1, maxAttempts), 500);
    } else {
      console.error("THREE.js failed to load after multiple attempts");
    }
  }

  // Start initialization attempts
  setTimeout(() => tryInitBlockchainExplorer(), 1000);
});
