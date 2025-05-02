<template>
  <div class="pixi-container" ref="pixiContainer"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as PIXI from 'pixi.js';

export default {
  name: 'PixiBackground',
  props: {
    backgroundColor: { type: String, default: '#3030D0' },
    accentColor: { type: String, default: '#FF97D6' }
  },
  setup() {
    const pixiContainer = ref(null);
    let app = null;
    let gridLines = [];
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
    const spacing = 40;
    let pinkBalls = [];

    // Store base positions for lines
    let verticals = [];
    let horizontals = [];

    // Helper to check if two circles overlap
    function circlesOverlap(x1, y1, r1, x2, y2, r2, padding = 8) {
      const dx = x1 - x2;
      const dy = y1 - y2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < (r1 + r2 + padding);
    }

    const createGridData = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      verticals = [];
      horizontals = [];
      for (let x = spacing / 2; x < width; x += spacing) {
        verticals.push(x);
      }
      for (let y = spacing / 2; y < height; y += spacing) {
        horizontals.push(y);
      }
    };

    const drawGrid = () => {
      if (!app) return;
      gridLines.forEach(line => {
        app.stage.removeChild(line);
      });
      gridLines = [];
      createGridData();

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Vertical lines
      verticals.forEach((baseX) => {
        const line = new PIXI.Graphics();
        line.moveTo(0, 0);
        line.lineTo(0, height);
        line.stroke({ color: 0xffffff, alpha: 0.7, pixelLine: true });
        line.position.set(baseX, 0);
        app.stage.addChild(line);
        gridLines.push({ type: 'v', gfx: line, base: baseX });
      });

      // Horizontal lines
      horizontals.forEach((baseY) => {
        const line = new PIXI.Graphics();
        line.moveTo(0, 0);
        line.lineTo(width, 0);
        line.stroke({ color: 0xffffff, alpha: 0.7, pixelLine: true });
        line.position.set(0, baseY);
        app.stage.addChild(line);
        gridLines.push({ type: 'h', gfx: line, base: baseY });
      });
    };

    const drawPinkBalls = () => {
      pinkBalls.forEach(ball => {
        app.stage.removeChild(ball.gfx || ball);
        (ball.gfx || ball).destroy();
      });
      pinkBalls = [];

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Ball sizes for each pair: [radius1, radius2]
      const pairs = [
        [width * 0.1, width * 0.12],
        [width * 0.1, width * 0.12],
        [width * 0.1, width * 0.12]
      ];

      // Store all balls' positions and radii for overlap checking
      const allBalls = [];
      const maxTries = 200;

      for (let i = 0; i < pairs.length; i++) {
        let placed = false;
        let tries = 0;
        while (!placed && tries < maxTries) {
          tries++;
          const r1 = pairs[i][0] / 2;
          const r2 = pairs[i][1] / 2;
          const margin = Math.max(r1, r2) + 10;
          const x1 = Math.random() * (width - 2 * margin) + margin;
          const y1 = Math.random() * (height - 2 * margin) + margin;
          const minDist = r1 + r2 + 10;
          const maxDist = r1 + r2 + 30;
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * (maxDist - minDist) + minDist;
          const x2 = x1 + Math.cos(angle) * dist;
          const y2 = y1 + Math.sin(angle) * dist;

          if (
            x2 - r2 < 0 || x2 + r2 > width ||
            y2 - r2 < 0 || y2 + r2 > height
          ) continue;

          let overlap = false;
          for (const b of allBalls) {
            if (
              circlesOverlap(x1, y1, r1, b.x, b.y, b.r, 4) ||
              circlesOverlap(x2, y2, r2, b.x, b.y, b.r, 4)
            ) {
              overlap = true;
              break;
            }
          }
          if (circlesOverlap(x1, y1, r1, x2, y2, r2, 2)) overlap = true;

          if (!overlap) {
            pinkBalls.push({
              x: x1, y: y1, r: r1, gfx: null,
              alpha: 0, scale: 1,
              movingToCenter: false,
              original: { x: x1, y: y1 }
            });
            allBalls.push({ x: x1, y: y1, r: r1 });
            pinkBalls.push({
              x: x2, y: y2, r: r2, gfx: null,
              alpha: 0, scale: 1,
              movingToCenter: false,
              original: { x: x2, y: y2 }
            });
            allBalls.push({ x: x2, y: y2, r: r2 });
            placed = true;
          }
        }
      }

      pinkBalls.forEach(ball => {
        // Add velocity for momentum
        ball.vx = 0;
        ball.vy = 0;
        const gfx = new PIXI.Graphics();
        gfx.beginFill(0xFF97D6, 1);
        gfx.drawCircle(0, 0, ball.r);
        gfx.endFill();
        gfx.position.set(ball.x, ball.y);
        gfx.alpha = 0;
        gfx.scale.set(1, 1);
        app.stage.addChild(gfx);
        ball.gfx = gfx;
      });
    };

    const animate = () => {
      const lensRadius = 180;
      const ballInsideAlpha = 1.0;
      const ballOutsideAlpha = 0.0;
      const insideScale = 0.5;
      const outsideScale = 1.0;
      const scaleEase = 0.09;
      const alphaEase = 0.09;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const momentum = 0.93;

      // Animate grid lines (segments)
      gridLines.forEach(lineObj => {
        lineObj.gfx.clear();

        if (lineObj.type === 'v') {
          const x = lineObj.base;
          const dx = x - mouse.x;
          if (Math.abs(dx) < lensRadius) {
            const yCenter = mouse.y;
            const yDelta = Math.sqrt(lensRadius * lensRadius - dx * dx);
            const yStart = Math.max(0, yCenter - yDelta);
            const yEnd = Math.min(height, yCenter + yDelta);

            // Above lens
            if (yStart > 0) {
              lineObj.gfx.moveTo(0, 0);
              lineObj.gfx.lineTo(0, yStart);
              lineObj.gfx.stroke({ color: 0xffffff, alpha: 0.18, pixelLine: true });
            }
            // Inside lens
            lineObj.gfx.moveTo(0, yStart);
            lineObj.gfx.lineTo(0, yEnd);
            lineObj.gfx.stroke({ color: 0xffffff, alpha: 1.0, pixelLine: true });
            // Below lens
            if (yEnd < height) {
              lineObj.gfx.moveTo(0, yEnd);
              lineObj.gfx.lineTo(0, height);
              lineObj.gfx.stroke({ color: 0xffffff, alpha: 0.18, pixelLine: true });
            }
          } else {
            lineObj.gfx.moveTo(0, 0);
            lineObj.gfx.lineTo(0, height);
            lineObj.gfx.stroke({ color: 0xffffff, alpha: 0.18, pixelLine: true });
          }
          lineObj.gfx.position.x = x;
          lineObj.gfx.position.y = 0;
        } else if (lineObj.type === 'h') {
          const y = lineObj.base;
          const dy = y - mouse.y;
          if (Math.abs(dy) < lensRadius) {
            const xCenter = mouse.x;
            const xDelta = Math.sqrt(lensRadius * lensRadius - dy * dy);
            const xStart = Math.max(0, xCenter - xDelta);
            const xEnd = Math.min(width, xCenter + xDelta);

            // Left of lens
            if (xStart > 0) {
              lineObj.gfx.moveTo(0, 0);
              lineObj.gfx.lineTo(xStart, 0);
              lineObj.gfx.stroke({ color: 0xffffff, alpha: 0.18, pixelLine: true });
            }
            // Inside lens
            lineObj.gfx.moveTo(xStart, 0);
            lineObj.gfx.lineTo(xEnd, 0);
            lineObj.gfx.stroke({ color: 0xffffff, alpha: 1.0, pixelLine: true });
            // Right of lens
            if (xEnd < width) {
              lineObj.gfx.moveTo(xEnd, 0);
              lineObj.gfx.lineTo(width, 0);
              lineObj.gfx.stroke({ color: 0xffffff, alpha: 0.18, pixelLine: true });
            }
          } else {
            lineObj.gfx.moveTo(0, 0);
            lineObj.gfx.lineTo(width, 0);
            lineObj.gfx.stroke({ color: 0xffffff, alpha: 0.18, pixelLine: true });
          }
          lineObj.gfx.position.x = 0;
          lineObj.gfx.position.y = y;
        }
      });

      pinkBalls.forEach((ball, idx) => {
        if (!ball.gfx) return;
        const dx = ball.x - mouse.x;
        const dy = ball.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const centerX = width / 2;
        const centerY = height / 2;

        // Animate alpha and scale first
        let targetAlpha = ballOutsideAlpha;
        let targetScale = outsideScale;
        let shouldMove = false;

        // If the ball has already started moving to center, keep it visible and at center
        if (ball.movingToCenter) {
          targetAlpha = ballInsideAlpha;
          targetScale = insideScale;
          shouldMove = true;
        } else if (dist < lensRadius) {
          targetAlpha = ballInsideAlpha;
          targetScale = insideScale;
        }

        ball.alpha += (targetAlpha - ball.alpha) * alphaEase;
        ball.scale += (targetScale - ball.scale) * scaleEase;

        // Only start moving if both alpha and scale are close to their targets and not already moving
        if (
          !ball.movingToCenter &&
          Math.abs(ball.alpha - ballInsideAlpha) < 0.03 &&
          Math.abs(ball.scale - insideScale) < 0.03 &&
          dist < lensRadius
        ) {
          shouldMove = true;
        }

        if (shouldMove) {
          ball.movingToCenter = true;
        }

        // If moving to center, animate with momentum
        if (ball.movingToCenter) {
          const tx = centerX - ball.x;
          const ty = centerY - ball.y;
          ball.vx = (ball.vx || 0) * momentum + tx * (1 - momentum);
          ball.vy = (ball.vy || 0) * momentum + ty * (1 - momentum);
          ball.x += ball.vx * (1 - momentum);
          ball.y += ball.vy * (1 - momentum);

          // Destroy when at center
          if (Math.abs(ball.x - centerX) < 0.5 && Math.abs(ball.y - centerY) < 0.5) {
            app.stage.removeChild(ball.gfx);
            ball.gfx.destroy();
            pinkBalls[idx] = null;
            return;
          }
        } else {
          // Stop velocity if not moving to center
          ball.vx = 0;
          ball.vy = 0;
        }

        if (ball.gfx) {
          ball.gfx.alpha = ball.alpha;
          ball.gfx.scale.set(ball.scale, ball.scale);
          ball.gfx.position.set(ball.x, ball.y);
        }
      });

      // Remove destroyed balls from array
      pinkBalls = pinkBalls.filter(b => b && b.gfx);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    };
    const handleTouchEnd = () => {
      mouse.active = false;
    };

    const handleResize = () => {
      drawGrid();
      drawPinkBalls();
    };

    const initPixi = async () => {
      app = new PIXI.Application();
      await app.init({
        backgroundAlpha: 0, // transparent background
        resizeTo: window,
        antialias: true
      });
      if (pixiContainer.value) {
        pixiContainer.value.appendChild(app.canvas);
        app.canvas.style.position = 'absolute';
        app.canvas.style.top = '0';
        app.canvas.style.left = '0';
        app.canvas.style.width = '100%';
        app.canvas.style.height = '100%';
        app.canvas.style.zIndex = '5';

        // First draw grid then draw balls to keep balls on top
        drawGrid();
        drawPinkBalls();

        app.ticker.add(animate);

        // Log for debugging
        console.log("PixiJS initialized, canvas dimensions:",
          app.canvas.width, "x", app.canvas.height);
      }
    };

    onMounted(() => {
      initPixi();
      window.addEventListener('resize', handleResize);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd, { passive: false });
    });
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (app) {
        app.destroy(true, { children: true });
        app = null;
      }
    });

    return { pixiContainer };
  }
}
</script>

<style scoped>
.pixi-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
}
</style>
