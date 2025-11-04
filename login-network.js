document.addEventListener("DOMContentLoaded", function () {
  // Create canvas for background animation
  const canvas = document.createElement("canvas");
  canvas.id = "networkCanvas";
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = 1; // Between background and content

  // Add canvas to page
  document.querySelector(".login-page").prepend(canvas);

  // Initialize canvas and context
  const ctx = canvas.getContext("2d");
  let width, height;
  let nodes = [];
  let nodeConnections = [];
  let cursorLines = [];
  let mousePosition = { x: null, y: null };
  let mouseRadius = 180;
  let animationInitialized = false;
  let lastFrameTime = 0;

  // Get accent color from CSS variables
  const getAccentColor = (opacity = 1) => {
    const accentRGB =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-color-rgb")
        .trim() || "0, 255, 255"; // Default to cyan
    return `rgba(${accentRGB}, ${opacity})`;
  };

  // Handle resize
  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Create network if not already created
    if (!animationInitialized) {
      createNetwork();
      animationInitialized = true;
    } else {
      // Adjust existing nodes to fit within new canvas dimensions
      nodes.forEach((node) => {
        if (node.x > width) node.x = width * Math.random();
        if (node.y > height) node.y = height * Math.random();
      });
    }
  }

  // Create network with nodes and connections
  function createNetwork() {
    nodes = [];
    nodeConnections = [];
    cursorLines = [];

    // Create a moderate number of particles
    const nodeCount = Math.min(Math.floor((width * height) / 10000), 150);

    // Create nodes with moderate speed
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 8,
        speedY: (Math.random() - 0.5) * 8,
        connectDistance: Math.random() * 150 + 100,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
        interactionStrength: Math.random() * 0.3 + 0.2,
        group: Math.floor(Math.random() * 6), // Fewer groups for more consistent connections
        connectionCount: 0,
        maxConnections: Math.floor(Math.random() * 2) + 2, // 2-3 connections to prevent overcrowding
        lastSpeedBoost: 0,
        glowIntensity: 0,
      });
    }

    // Create consistent initial connections
    createStableConnections();

    // Create cursor lines
    for (let i = 0; i < 6; i++) {
      cursorLines.push({
        node: Math.floor(Math.random() * nodes.length),
        opacity: 0,
        targetOpacity: 0,
        speed: Math.random() * 0.1 + 0.05,
      });
    }
  }

  // Create stable network connections that don't change drastically over time
  function createStableConnections() {
    // Clear existing connections
    nodeConnections = [];

    // Reset connection counts
    nodes.forEach((node) => {
      node.connectionCount = 0;
    });

    // Process each group separately
    for (let groupId = 0; groupId < 6; groupId++) {
      const groupNodes = nodes.filter((node) => node.group === groupId);

      if (groupNodes.length <= 1) continue;

      // Create a minimum spanning tree to ensure all nodes are connected
      const mstEdges = createMinimumSpanningTree(groupNodes);

      // Add MST edges as connections
      for (const edge of mstEdges) {
        const fromIndex = nodes.indexOf(edge.from);
        const toIndex = nodes.indexOf(edge.to);

        if (fromIndex !== -1 && toIndex !== -1) {
          addStableConnection(fromIndex, toIndex);
        }
      }

      // Add a few additional connections for visual interest (not too many)
      const additionalConnections = Math.min(
        Math.floor(groupNodes.length / 3),
        5
      );
      let addedCount = 0;

      for (
        let i = 0;
        i < groupNodes.length && addedCount < additionalConnections;
        i++
      ) {
        const node = groupNodes[i];
        const nodeIndex = nodes.indexOf(node);

        // Don't add more connections if this node is already at max
        if (node.connectionCount >= node.maxConnections) continue;

        // Find closest node not already connected
        const otherNodes = groupNodes
          .filter((otherNode) => {
            const otherIndex = nodes.indexOf(otherNode);
            // Skip self, already connected, or max connections
            return (
              otherNode !== node &&
              !nodeConnections.some(
                (conn) =>
                  (conn.from === nodeIndex && conn.to === otherIndex) ||
                  (conn.from === otherIndex && conn.to === nodeIndex)
              ) &&
              otherNode.connectionCount < otherNode.maxConnections
            );
          })
          .map((otherNode) => {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            return {
              node: otherNode,
              distance: Math.sqrt(dx * dx + dy * dy),
            };
          })
          .sort((a, b) => a.distance - b.distance);

        if (otherNodes.length > 0) {
          const targetNode = otherNodes[0].node;
          const targetIndex = nodes.indexOf(targetNode);

          if (addStableConnection(nodeIndex, targetIndex)) {
            addedCount++;
          }
        }
      }
    }
  }

  // Helper function to create a minimum spanning tree for a group
  function createMinimumSpanningTree(groupNodes) {
    // If only one node, no edges
    if (groupNodes.length <= 1) return [];

    // Calculate all possible edges with distances
    const edges = [];
    for (let i = 0; i < groupNodes.length; i++) {
      for (let j = i + 1; j < groupNodes.length; j++) {
        const node1 = groupNodes[i];
        const node2 = groupNodes[j];
        const dx = node1.x - node2.x;
        const dy = node1.y - node2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        edges.push({ from: node1, to: node2, distance });
      }
    }

    // Sort edges by distance
    edges.sort((a, b) => a.distance - b.distance);

    // Kruskal's algorithm
    const parent = {};
    const rank = {};

    // Initialize disjoint set
    groupNodes.forEach((node) => {
      parent[node] = node;
      rank[node] = 0;
    });

    // Find with path compression
    function find(node) {
      if (parent[node] !== node) {
        parent[node] = find(parent[node]);
      }
      return parent[node];
    }

    // Union by rank
    function union(x, y) {
      const rootX = find(x);
      const rootY = find(y);

      if (rootX === rootY) return;

      if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
      } else if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX;
      } else {
        parent[rootY] = rootX;
        rank[rootX]++;
      }
    }

    // Build MST
    const mst = [];
    for (const edge of edges) {
      const fromRoot = find(edge.from);
      const toRoot = find(edge.to);

      if (fromRoot !== toRoot) {
        mst.push(edge);
        union(edge.from, edge.to);

        // Stop when we have n-1 edges (a complete MST)
        if (mst.length === groupNodes.length - 1) break;
      }
    }

    return mst;
  }

  // Add a stable connection between nodes
  function addStableConnection(fromIndex, toIndex) {
    // Check if connection already exists
    if (
      nodeConnections.some(
        (conn) =>
          (conn.from === fromIndex && conn.to === toIndex) ||
          (conn.from === toIndex && conn.to === fromIndex)
      )
    ) {
      return false;
    }

    // Check if either node is at max connections
    if (
      nodes[fromIndex].connectionCount >= nodes[fromIndex].maxConnections ||
      nodes[toIndex].connectionCount >= nodes[toIndex].maxConnections
    ) {
      return false;
    }

    // Create connection
    nodeConnections.push({
      from: fromIndex,
      to: toIndex,
      baseOpacity: Math.random() * 0.3 + 0.2,
      opacity: Math.random() * 0.3 + 0.2,
      pulseParticles: [],
      permanent: true,
      energyFlow: Math.random() > 0.7,
      energyColor: getAccentColor(0.8),
      width: Math.random() * 0.6 + 1.2,
      initialCreation: true, // Flag to gradually fade in connections
    });

    // Add pulse particles for energy flow
    const connection = nodeConnections[nodeConnections.length - 1];
    if (connection.energyFlow) {
      const pulseCount = Math.floor(Math.random() * 2) + 1;
      for (let p = 0; p < pulseCount; p++) {
        connection.pulseParticles.push({
          position: Math.random(),
          size: Math.random() * 1.8 + 0.8,
          speed: Math.random() * 0.002 + 0.001,
          active: true,
          direction: Math.random() > 0.5 ? 1 : -1,
          initialDelay: Math.random() * 2000, // Stagger pulse particle appearance
        });
      }
    }

    // Update connection counts
    nodes[fromIndex].connectionCount++;
    nodes[toIndex].connectionCount++;

    return true;
  }

  // Animation loop with fade-in
  function animate(timestamp) {
    ctx.clearRect(0, 0, width, height);
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    // Calculate animation progress for initial fade-in
    const animProgress = Math.min(1, (timestamp - animationStartTime) / 2000);

    // Update and draw nodes
    updateNodes(deltaTime, animProgress);

    // Draw node connections with fade-in effect
    drawNodeConnections(animProgress);

    // Draw cursor connections
    drawCursorConnections();

    requestAnimationFrame(animate);
  }

  // Update nodes
  function updateNodes(deltaTime, fadeProgress) {
    const currentTime = Date.now();

    nodes.forEach((node, index) => {
      // Apply mouse interaction
      if (mousePosition.x !== null && mousePosition.y !== null) {
        const dx = mousePosition.x - node.x;
        const dy = mousePosition.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          // Calculate attraction force
          const force =
            (1 - distance / mouseRadius) * node.interactionStrength * 2;
          const angle = Math.atan2(dy, dx);

          // Apply attraction force - pull nodes toward cursor
          node.speedX += Math.cos(angle) * force;
          node.speedY += Math.sin(angle) * force;

          // Increase glow intensity
          node.glowIntensity = Math.min(1, node.glowIntensity + 0.1);
          node.lastSpeedBoost = currentTime;
        }
      }

      // Update position with current speed
      node.x += node.speedX;
      node.y += node.speedY;

      // Calculate velocity for glow effect
      const velocity = Math.sqrt(
        node.speedX * node.speedX + node.speedY * node.speedY
      );

      // Boost glow intensity based on velocity
      if (velocity > 3) {
        node.glowIntensity = Math.min(1, node.glowIntensity + velocity / 20);
        node.lastSpeedBoost = currentTime;
      }

      // Gradually reduce glow intensity
      if (currentTime - node.lastSpeedBoost > 300) {
        node.glowIntensity *= 0.95;
      }

      // Apply friction
      node.speedX *= 0.98;
      node.speedY *= 0.98;

      // Bounce off edges
      if (node.x <= 0 || node.x >= width) {
        node.speedX *= -1;
        node.speedY += (Math.random() - 0.5) * 2;
        node.glowIntensity = Math.min(1, node.glowIntensity + 0.3);
        node.lastSpeedBoost = currentTime;
      }
      if (node.y <= 0 || node.y >= height) {
        node.speedY *= -1;
        node.speedX += (Math.random() - 0.5) * 2;
        node.glowIntensity = Math.min(1, node.glowIntensity + 0.3);
        node.lastSpeedBoost = currentTime;
      }

      // Ensure node stays within bounds
      node.x = Math.max(0, Math.min(width, node.x));
      node.y = Math.max(0, Math.min(height, node.y));

      // Occasionally change direction randomly
      if (Math.random() < 0.01) {
        node.speedX += (Math.random() - 0.5) * 3;
        node.speedY += (Math.random() - 0.5) * 3;
        node.glowIntensity = Math.min(1, node.glowIntensity + 0.2);
        node.lastSpeedBoost = currentTime;
      }

      // Apply fade-in effect to nodes
      const nodeOpacity = 0.6 * fadeProgress + 0.4 * Math.min(1, index / 20);

      // Draw node with enhanced glow based on movement
      const pulse =
        Math.sin(currentTime * 0.001 * node.pulseSpeed + node.pulseOffset) *
          0.5 +
        0.5;
      const radius = node.radius * (0.8 + pulse * 0.4);

      // Base node
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = getAccentColor(nodeOpacity * (0.6 + pulse * 0.4));
      ctx.fill();

      // Enhanced glow effect based on speed
      if (node.glowIntensity > 0.05) {
        const glow = ctx.createRadialGradient(
          node.x,
          node.y,
          radius * 0.5,
          node.x,
          node.y,
          radius * (3 + node.glowIntensity * 2)
        );
        glow.addColorStop(
          0,
          getAccentColor(nodeOpacity * 0.5 * node.glowIntensity)
        );
        glow.addColorStop(1, getAccentColor(0));

        ctx.beginPath();
        ctx.arc(
          node.x,
          node.y,
          radius * (3 + node.glowIntensity * 2),
          0,
          Math.PI * 2
        );
        ctx.fillStyle = glow;
        ctx.fill();
      }
    });
  }

  // Draw node-to-node connections
  function drawNodeConnections(fadeProgress) {
    const currentTime = Date.now();

    nodeConnections.forEach((connection, index) => {
      const fromNode = nodes[connection.from];
      const toNode = nodes[connection.to];

      // Skip if nodes are undefined
      if (!fromNode || !toNode) return;

      // Calculate distance
      const dx = fromNode.x - toNode.x;
      const dy = fromNode.y - toNode.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate connection opacity with fade-in effect
      // New connections fade in gradually
      let connectionFade = fadeProgress;
      if (connection.initialCreation) {
        connectionFade *= Math.min(1, index / 20); // Stagger connection appearance
        // Remove initial flag after fade-in
        if (connectionFade >= 0.99) {
          connection.initialCreation = false;
        }
      }

      // Calculate combined movement speed of connected nodes
      const totalSpeed = Math.sqrt(
        fromNode.speedX * fromNode.speedX +
          fromNode.speedY * fromNode.speedY +
          toNode.speedX * toNode.speedX +
          toNode.speedY * toNode.speedY
      );

      // Boost connection opacity based on node movement
      const speedBoost = Math.min(1, totalSpeed / 10);
      const glowBoost = Math.max(fromNode.glowIntensity, toNode.glowIntensity);

      // Pulsing effect
      const pulseEffect = Math.sin(currentTime * 0.001) * 0.15 + 0.85;

      // Dynamic opacity
      const dynamicOpacity =
        connection.baseOpacity *
        pulseEffect *
        (1 + speedBoost * 0.5) *
        connectionFade;

      // Draw main connection line
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = getAccentColor(dynamicOpacity);
      ctx.lineWidth = connection.width * (1 + speedBoost * 0.3);
      ctx.stroke();

      // Enhanced glow effect for moving connections
      if (glowBoost > 0.1 || speedBoost > 0.2) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = getAccentColor(dynamicOpacity * 0.5);
        ctx.lineWidth = connection.width * (2 + glowBoost * 2);
        ctx.filter = `blur(${2 + glowBoost}px)`;
        ctx.stroke();
        ctx.filter = "none";
      }

      // Update and draw pulse particles with staggered appearance
      if (connection.energyFlow) {
        connection.pulseParticles.forEach((particle) => {
          // Check if particle should be active yet (staggered start)
          const particleActive =
            currentTime > animationStartTime + particle.initialDelay;
          if (!particleActive) return;

          // Move particle along the line
          particle.position += particle.speed * particle.direction;

          // Loop particle when it reaches the end
          if (particle.position >= 1 || particle.position <= 0) {
            particle.direction *= -1;
            particle.position = particle.direction > 0 ? 0 : 1;
            particle.speed = Math.random() * 0.002 + 0.001;
          }

          // Calculate particle position along the line
          const particleX =
            fromNode.x + (toNode.x - fromNode.x) * particle.position;
          const particleY =
            fromNode.y + (toNode.y - fromNode.y) * particle.position;

          // Apply fade-in to pulse particles
          const particleOpacity = connectionFade;

          // Enhanced pulse particle with glow effect
          const particleSize = particle.size * (1 + speedBoost * 0.5);

          // Draw main particle
          ctx.beginPath();
          ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
          ctx.fillStyle = connection.energyColor.replace(
            "0.8)",
            `${0.8 * particleOpacity})`
          );
          ctx.fill();

          // Draw particle glow
          ctx.beginPath();
          ctx.arc(particleX, particleY, particleSize * 3, 0, Math.PI * 2);
          const particleGlow = ctx.createRadialGradient(
            particleX,
            particleY,
            particleSize * 0.5,
            particleX,
            particleY,
            particleSize * 3
          );
          particleGlow.addColorStop(0, getAccentColor(0.6 * particleOpacity));
          particleGlow.addColorStop(1, getAccentColor(0));
          ctx.fillStyle = particleGlow;
          ctx.fill();
        });
      }
    });
  }

  // Draw cursor connections
  function drawCursorConnections() {
    if (mousePosition.x === null || mousePosition.y === null) {
      // Fade out cursor lines when mouse is not on screen
      cursorLines.forEach((line) => {
        line.targetOpacity = 0;
      });
    } else {
      // Find the nodes closest to cursor
      const nodeDists = nodes
        .map((node, index) => {
          const dx = node.x - mousePosition.x;
          const dy = node.y - mousePosition.y;
          return {
            index: index,
            distance: Math.sqrt(dx * dx + dy * dy),
          };
        })
        .sort((a, b) => a.distance - b.distance);

      // Update cursor lines to target the closest nodes
      cursorLines.forEach((line, i) => {
        if (i < nodeDists.length && nodeDists[i].distance < mouseRadius * 1.5) {
          line.node = nodeDists[i].index;
          line.targetOpacity = Math.max(
            0,
            1 - nodeDists[i].distance / (mouseRadius * 1.5)
          );
        } else {
          line.targetOpacity = 0;
        }

        // Smooth opacity transition
        line.opacity += (line.targetOpacity - line.opacity) * line.speed;

        // Draw line if visible
        if (line.opacity > 0.01) {
          const node = nodes[line.node];

          ctx.beginPath();
          ctx.moveTo(mousePosition.x, mousePosition.y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = getAccentColor(line.opacity * 0.7);
          ctx.lineWidth = 1.8; // Reduced from 3.6 to 1.8
          ctx.stroke();

          // Thinner glow
          ctx.beginPath();
          ctx.moveTo(mousePosition.x, mousePosition.y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = getAccentColor(line.opacity * 0.3);
          ctx.lineWidth = 3; // Reduced from 6 to 3
          ctx.filter = "blur(2px)"; // Reduced blur
          ctx.stroke();
          ctx.filter = "none";

          // Add pulse effect along cursor lines
          const pulsePos = (Date.now() * 0.001) % 1;
          const pulseX =
            mousePosition.x + (node.x - mousePosition.x) * pulsePos;
          const pulseY =
            mousePosition.y + (node.y - mousePosition.y) * pulsePos;

          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
          ctx.fillStyle = getAccentColor(line.opacity);
          ctx.fill();
        }
      });
    }
  }

  // Initialize animation
  let animationStartTime = 0;

  function init() {
    resizeCanvas();
    animationStartTime = performance.now();
    lastFrameTime = animationStartTime;
    animate(animationStartTime);

    // Event listeners
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", function (e) {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    });
    window.addEventListener("mouseleave", function () {
      mousePosition.x = null;
      mousePosition.y = null;
    });
  }

  init();
});
