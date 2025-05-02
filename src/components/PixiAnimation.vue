<template>
  <div class="pixi-container" ref="pixiContainer"></div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as PIXI from 'pixi.js';

export default {
  name: 'PixiAnimation',
  props: {
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 600
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    },
    themeColor: {
      type: String,
      default: '#3030D0'
    }
  },
  setup(props) {
    const pixiContainer = ref(null);
    let app = null;
    let particles = [];
    const numParticles = 50;

    // Initialize PixiJS
    const initPixi = () => {
      if (!pixiContainer.value) return;

      // Create PixiJS application
      app = new PIXI.Application({
        width: props.width,
        height: props.height,
        backgroundAlpha: props.backgroundColor === 'transparent' ? 0 : 1,
        backgroundColor: props.backgroundColor !== 'transparent' ?
          parseInt(props.backgroundColor.replace('#', '0x'), 16) : 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
      });

      // Add canvas to the DOM
      pixiContainer.value.appendChild(app.view);

      // Make the canvas responsive
      app.renderer.view.style.width = '100%';
      app.renderer.view.style.height = '100%';

      // Create particles
      createParticles();

      // Start animation loop
      app.ticker.add(animate);
    };

    // Create particles
    const createParticles = () => {
      // Clear existing particles
      if (particles.length) {
        particles.forEach(p => app.stage.removeChild(p));
        particles = [];
      }

      // Get the theme color in hexadecimal format for PixiJS
      const hexColor = parseInt(props.themeColor.replace('#', '0x'), 16);

      // Create new particles
      for (let i = 0; i < numParticles; i++) {
        const particle = new PIXI.Graphics();
        const size = Math.random() * 8 + 2;

        // Draw circle with theme color
        particle.beginFill(hexColor, 0.2);
        particle.drawCircle(0, 0, size);
        particle.endFill();

        // Random position
        particle.x = Math.random() * props.width;
        particle.y = Math.random() * props.height;

        // Random speed
        particle.vx = (Math.random() - 0.5) * 1;
        particle.vy = (Math.random() - 0.5) * 1;

        // Add to stage and store reference
        app.stage.addChild(particle);
        particles.push(particle);
      }
    };

    // Animation loop
    const animate = () => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > props.width) p.vx *= -1;
        if (p.y < 0 || p.y > props.height) p.vy *= -1;
      }
    };

    // Handle resize
    const handleResize = () => {
      if (!app) return;

      // Update app dimensions
      app.renderer.resize(props.width, props.height);

      // Reposition particles
      createParticles();
    };

    // Watch for prop changes
    watch(() => props.themeColor, () => {
      if (app) createParticles();
    });

    watch(() => props.width, handleResize);
    watch(() => props.height, handleResize);

    onMounted(() => {
      initPixi();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      if (app) {
        app.destroy(true, true);
        app = null;
      }
    });

    return {
      pixiContainer
    };
  }
}
</script>

<style scoped>
.pixi-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  /* Allow clicks to pass through */
}
</style>
