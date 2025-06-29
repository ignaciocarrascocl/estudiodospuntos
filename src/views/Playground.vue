<template>
  <div class="playground-view">
    <div class="pixi-shader-container" ref="pixiContainer"></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as PIXI from 'pixi.js';

export default {
  name: 'PlaygroundView',
  setup() {
    const pixiContainer = ref(null);
    let app = null;
    let backgroundContainer = null;
    let particles = [];
    let ripples = [];
    let time = 0;
    let mousePos = { x: 0, y: 0 };
    let mousePressed = false;
    let mouseTrail = [];

    // Performance optimizations - reuse graphics objects
    let backgroundGraphics = null;
    let gradientGraphics = null;
    let mouseEffectGraphics = null;
    let tunnelGraphics = null;
    let trailGraphics = null;
    let frameCount = 0;

    // Colores del sitio
    const siteColors = {
      blue: 0x3030D0,
      pink: 0xFF97D6,
      lightBlue: 0x4080FF,
      darkBlue: 0x1020A0,
      lightPink: 0xFFB3E6
    };

    const initPixi = async () => {
      if (!pixiContainer.value) return;

      // Crear aplicación PIXI
      app = new PIXI.Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        antialias: true,
        backgroundAlpha: 1
      });

      pixiContainer.value.appendChild(app.canvas);

      // Crear contenedor para todos los efectos
      backgroundContainer = new PIXI.Container();
      app.stage.addChild(backgroundContainer);

      // Inicializar partículas para efectos
      initParticles();

      // Función de animación principal
      const animate = () => {
        time += 0.016; // ~60fps
        frameCount++;

        // Update particles and ripples every frame
        updateParticles();
        updateRipples();
        updateMouseTrail();

        // Update background effects less frequently for performance
        if (frameCount % 2 === 0) { // Update every other frame (30fps)
          drawPsychedelicBackground();
        }
      };

      // Event listeners para interactividad
      const handleMouseMove = (event) => {
        mousePos.x = event.clientX;
        mousePos.y = event.clientY;

        // Crear trail de mouse con velocidad variable
        mouseTrail.push({
          x: mousePos.x,
          y: mousePos.y,
          life: 1.0,
          velocity: Math.sqrt((mousePos.x - (mouseTrail[mouseTrail.length - 1]?.x || mousePos.x)) ** 2 +
                              (mousePos.y - (mouseTrail[mouseTrail.length - 1]?.y || mousePos.y)) ** 2) || 0
        });
        if (mouseTrail.length > 15) mouseTrail.shift(); // Trail más corto para performance

        // Crear partículas basadas en la velocidad del mouse (reducido para performance)
        const mouseVelocity = mouseTrail[mouseTrail.length - 1]?.velocity || 0;
        const particleChance = Math.min(0.3, mouseVelocity / 40); // Reducido: menos partículas

        if (Math.random() < particleChance && particles.length < 50) { // Límite de partículas
          createInteractiveParticle(mousePos.x, mousePos.y);
        }
      };

      const handleMouseDown = (event) => {
        mousePressed = true;
        createRipple(event.clientX, event.clientY, 'click');
      };

      const handleMouseUp = () => {
        mousePressed = false;
      };

      const handleTouchMove = (event) => {
        if (event.touches.length > 0) {
          const touch = event.touches[0];
          mousePos.x = touch.clientX;
          mousePos.y = touch.clientY;

          // Crear trail de touch
          mouseTrail.push({ x: mousePos.x, y: mousePos.y, life: 1.0 });
          if (mouseTrail.length > 12) mouseTrail.shift(); // Trail más corto para performance

          if (Math.random() < 0.2 && particles.length < 50) { // Reducido para performance
            createInteractiveParticle(mousePos.x, mousePos.y);
          }
        }
      };

      const handleTouchStart = (event) => {
        if (event.touches.length > 0) {
          const touch = event.touches[0];
          mousePressed = true;
          createRipple(touch.clientX, touch.clientY, 'touch');
        }
      };

      const handleTouchEnd = () => {
        mousePressed = false;
      };

      const handleClick = (event) => {
        // Explosión de partículas en click (reducido para performance)
        for (let i = 0; i < 8; i++) { // Reducido de 15 a 8
          createInteractiveParticle(
            event.clientX + (Math.random() - 0.5) * 100,
            event.clientY + (Math.random() - 0.5) * 100,
            true
          );
        }
        createRipple(event.clientX, event.clientY, 'explosion');
      };

      // Añadir event listeners
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('click', handleClick);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchend', handleTouchEnd, { passive: true });

      // Añadir al ticker para animación
      app.ticker.add(animate);

      // Manejar redimensionamiento
      const handleResize = () => {
        if (app) {
          app.renderer.resize(window.innerWidth, window.innerHeight);
          initParticles(); // Reinicializar partículas
        }
      };

      window.addEventListener('resize', handleResize);

      // Store cleanup functions
      app._customCleanup = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('click', handleClick);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('resize', handleResize);
      };
    };

    // Crear partículas interactivas
    const createInteractiveParticle = (x, y, explosion = false) => {
      const particle = {
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * (explosion ? 8 : 3),
        vy: (Math.random() - 0.5) * (explosion ? 8 : 3),
        radius: Math.random() * (explosion ? 6 : 4) + 2,
        color: Math.random() < 0.5 ? siteColors.blue : siteColors.pink,
        alpha: explosion ? 1.0 : 0.8,
        life: 1.0,
        decay: explosion ? 0.02 : 0.01,
        gfx: new PIXI.Graphics()
      };

      if (backgroundContainer) {
        backgroundContainer.addChild(particle.gfx);
        particles.push(particle);
      }
    };

    // Crear ondas/ripples
    const createRipple = (x, y, type = 'normal') => {
      const ripple = {
        x: x,
        y: y,
        radius: 0,
        maxRadius: type === 'explosion' ? 200 : type === 'click' ? 100 : 80,
        color: type === 'explosion' ? siteColors.pink : siteColors.blue,
        alpha: type === 'explosion' ? 0.8 : 0.5,
        growth: type === 'explosion' ? 8 : type === 'click' ? 4 : 2,
        decay: 0.02,
        gfx: new PIXI.Graphics()
      };

      if (backgroundContainer) {
        backgroundContainer.addChild(ripple.gfx);
        ripples.push(ripple);
      }
    };

    const initParticles = () => {
      // Limpiar partículas existentes
      particles.forEach(particle => {
        if (particle.gfx && backgroundContainer) {
          backgroundContainer.removeChild(particle.gfx);
          particle.gfx.destroy();
        }
      });
      particles = [];

      // Crear partículas iniciales más sutiles (reducido para performance)
      const numParticles = 15; // Reducido de 30 a 15
      for (let i = 0; i < numParticles; i++) {
        const particle = {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          radius: Math.random() * 2 + 1,
          color: Math.random() < 0.5 ? siteColors.blue : siteColors.pink,
          alpha: Math.random() * 0.3 + 0.2,
          life: 1.0,
          decay: 0.005,
          gfx: new PIXI.Graphics()
        };

        backgroundContainer.addChild(particle.gfx);
        particles.push(particle);
      }
    };

    const drawPsychedelicBackground = () => {
      if (!backgroundContainer) return;

      // Initialize graphics objects if needed
      if (!backgroundGraphics) {
        backgroundGraphics = new PIXI.Graphics();
        gradientGraphics = new PIXI.Graphics();
        mouseEffectGraphics = new PIXI.Graphics();
        tunnelGraphics = new PIXI.Graphics();

        backgroundContainer.addChild(backgroundGraphics);
        backgroundContainer.addChild(gradientGraphics);
        backgroundContainer.addChild(mouseEffectGraphics);
        backgroundContainer.addChild(tunnelGraphics);
      }

      // Clear only the reusable graphics, not particles/ripples
      backgroundGraphics.clear();
      gradientGraphics.clear();
      mouseEffectGraphics.clear();
      tunnelGraphics.clear();

      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Gradiente interactivo fluido que responde al mouse (optimizado)
      // Reducir capas de gradiente para mejor performance
      const numBaseLayers = 6; // Reducido de 12 a 6
      for (let layer = 0; layer < numBaseLayers; layer++) {
        const normalizedLayer = layer / numBaseLayers;
        const rotationOffset = time * 0.1 + layer * 0.1;

        // Posición que oscila suavemente
        const baseX = centerX + Math.cos(rotationOffset) * 60 * (1 - normalizedLayer);
        const baseY = centerY + Math.sin(rotationOffset) * 60 * (1 - normalizedLayer);

        // Influencia del mouse con suavizado exponencial
        const mouseInfluence = Math.exp(-normalizedLayer * 2);
        const gradientCenterX = baseX + (mousePos.x - centerX) * mouseInfluence * 0.4;
        const gradientCenterY = baseY + (mousePos.y - centerY) * mouseInfluence * 0.4;

        // Radio dinámico con pulsación
        const pulsePhase = time * 2 + layer * 0.3;
        const baseRadius = (layer + 1) * 70;
        const radiusVariation = Math.sin(pulsePhase) * 25;
        const radius = baseRadius + radiusVariation;

        // Color con transición temporal suave
        const colorPhase = (time * 20 + layer * 25) % 360;
        let color, alpha;

        if (colorPhase < 120) {
          color = siteColors.blue;
          alpha = 0.08 + Math.sin(pulsePhase) * 0.03;
        } else if (colorPhase < 240) {
          color = siteColors.pink;
          alpha = 0.08 + Math.cos(pulsePhase) * 0.03;
        } else {
          color = siteColors.lightBlue;
          alpha = 0.06 + Math.sin(pulsePhase * 0.5) * 0.02;
        }

        // Intensificar cerca del mouse
        const mouseDistance = Math.sqrt((mousePos.x - gradientCenterX) ** 2 + (mousePos.y - gradientCenterY) ** 2);
        const distanceFactor = Math.max(0, 1 - mouseDistance / 300);
        alpha += distanceFactor * 0.1;

        gradientGraphics.beginFill(color, alpha);
        gradientGraphics.drawCircle(gradientCenterX, gradientCenterY, radius);
        gradientGraphics.endFill();
      }

      // Halo dinámico alrededor del mouse (simplificado)
      const mouseHaloRadius = 150 + Math.sin(time * 3) * 30;
      const haloAlpha = 0.15 + Math.sin(time * 4) * 0.05;

      // Reducir anillos de halo para performance
      for (let ring = 0; ring < 2; ring++) { // Reducido de 4 a 2
        const ringRadius = mouseHaloRadius + ring * 40;
        const ringAlpha = haloAlpha * (1 - ring * 0.3);
        const colorIndex = (Math.floor(time * 2) + ring) % 2;
        const ringColor = colorIndex === 0 ? siteColors.blue : siteColors.pink;

        gradientGraphics.beginFill(ringColor, ringAlpha);
        gradientGraphics.drawCircle(mousePos.x, mousePos.y, ringRadius);
        gradientGraphics.endFill();
      }

      // Efecto de explosión durante click/touch (optimizado)
      if (mousePressed) {
        const explosionLayers = 3; // Reducido de 6 a 3
        for (let exp = 0; exp < explosionLayers; exp++) {
          const explosionRadius = 80 + exp * 30 + Math.sin(time * 6 + exp) * 15;
          const explosionAlpha = 0.2 * (1 - exp / explosionLayers);
          const explosionColor = exp % 2 === 0 ? siteColors.pink : siteColors.blue;

          gradientGraphics.beginFill(explosionColor, explosionAlpha);
          gradientGraphics.drawCircle(mousePos.x, mousePos.y, explosionRadius);
          gradientGraphics.endFill();
        }

        // Rayos de energía que salen del punto de click (reducidos)
        const numRays = 4; // Reducido de 8 a 4
        for (let ray = 0; ray < numRays; ray++) {
          const rayAngle = (ray / numRays) * Math.PI * 2 + time * 2;
          const rayLength = 100 + Math.sin(time * 4 + ray) * 30;

          const rayEndX = mousePos.x + Math.cos(rayAngle) * rayLength;
          const rayEndY = mousePos.y + Math.sin(rayAngle) * rayLength;

          gradientGraphics.lineStyle(4, siteColors.lightPink, 0.6);
          gradientGraphics.moveTo(mousePos.x, mousePos.y);
          gradientGraphics.lineTo(rayEndX, rayEndY);
        }
      }

      // 2. Efecto de mouse - explosión de colores (optimizado)
      const mouseDist = Math.sqrt((mousePos.x - centerX) ** 2 + (mousePos.y - centerY) ** 2);
      if (mouseDist < 300) {
        const numRays = mousePressed ? 12 : 8; // Reducido de 24/16 a 12/8
        for (let ray = 0; ray < numRays; ray++) {
          const angle = (ray / numRays) * Math.PI * 2 + time * 3;
          const length = (300 - mouseDist) * (mousePressed ? 1.5 : 1);
          const color = ray % 2 === 0 ? siteColors.blue : siteColors.pink;
          const alpha = mousePressed ? 0.8 : 0.4;

          mouseEffectGraphics.lineStyle(mousePressed ? 6 : 3, color, alpha);
          mouseEffectGraphics.moveTo(mousePos.x, mousePos.y);
          mouseEffectGraphics.lineTo(
            mousePos.x + Math.cos(angle) * length,
            mousePos.y + Math.sin(angle) * length
          );
        }
      }

      // 3. Túneles psicodélicos (simplificados)
      const numTunnels = 2; // Reducido de 4 a 2
      for (let tunnel = 0; tunnel < numTunnels; tunnel++) {
        const tunnelTime = time * (0.4 + tunnel * 0.2);
        const color = tunnel % 2 === 0 ? siteColors.lightBlue : siteColors.lightPink;

        for (let ring = 0; ring < 8; ring++) { // Reducido de 15 a 8
          const radius = ring * 30 + Math.sin(tunnelTime + ring * 0.4) * 15;
          const alpha = 0.2 - (ring / 8) * 0.15;

          tunnelGraphics.lineStyle(2, color, alpha);
          tunnelGraphics.drawCircle(
            centerX + Math.cos(tunnelTime + tunnel * 1.5) * 120,
            centerY + Math.sin(tunnelTime + tunnel * 1.5) * 120,
            radius
          );
        }
      }

      // 4. Fondo base con gradiente (simplificado)
      for (let i = 0; i < 4; i++) { // Reducido de 8 a 4
        const radius = (i + 1) * Math.min(width, height) * 0.12;
        const color = i % 2 === 0 ? siteColors.darkBlue : siteColors.blue;
        const alpha = 0.03;

        backgroundGraphics.beginFill(color, alpha);
        backgroundGraphics.drawCircle(centerX, centerY, radius);
        backgroundGraphics.endFill();
      }
    };

    const updateParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];

        // Actualizar posición
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Aplicar gravedad sutil
        particle.vy += 0.02;

        // Reducir velocidad (fricción)
        particle.vx *= 0.998;
        particle.vy *= 0.998;

        // Rebote en bordes
        if (particle.x < 0 || particle.x > window.innerWidth) {
          particle.vx *= -0.8;
          particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
        }
        if (particle.y < 0 || particle.y > window.innerHeight) {
          particle.vy *= -0.8;
          particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));
        }

        // Reducir vida
        particle.life -= particle.decay;
        particle.alpha = particle.life;

        // Dibujar partícula
        particle.gfx.clear();
        particle.gfx.beginFill(particle.color, particle.alpha);
        particle.gfx.drawCircle(particle.x, particle.y, particle.radius);
        particle.gfx.endFill();

        // Efecto de atracción hacia el mouse (más sutil)
        const dx = mousePos.x - particle.x;
        const dy = mousePos.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 0.05;
          particle.vx += (dx / dist) * force;
          particle.vy += (dy / dist) * force;
        }

        // Remover partícula si está muerta
        if (particle.life <= 0) {
          backgroundContainer.removeChild(particle.gfx);
          particle.gfx.destroy();
          particles.splice(i, 1);
        }
      }
    };

    const updateRipples = () => {
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];

        // Actualizar ripple
        ripple.radius += ripple.growth;
        ripple.alpha -= ripple.decay;

        // Dibujar ripple
        ripple.gfx.clear();
        ripple.gfx.lineStyle(3, ripple.color, ripple.alpha);
        ripple.gfx.drawCircle(ripple.x, ripple.y, ripple.radius);

        // Remover ripple si está completo
        if (ripple.radius >= ripple.maxRadius || ripple.alpha <= 0) {
          backgroundContainer.removeChild(ripple.gfx);
          ripple.gfx.destroy();
          ripples.splice(i, 1);
        }
      }
    };

    const updateMouseTrail = () => {
      for (let i = mouseTrail.length - 1; i >= 0; i--) {
        const trail = mouseTrail[i];
        trail.life -= 0.03; // Más lento para trail más persistente

        if (trail.life <= 0) {
          mouseTrail.splice(i, 1);
        }
      }

      // Dibujar trail de mouse con efecto más sofisticado (optimizado)
      if (mouseTrail.length > 1) {
        if (!trailGraphics) {
          trailGraphics = new PIXI.Graphics();
          backgroundContainer.addChild(trailGraphics);
        }

        trailGraphics.clear();

        // Reducir puntos del trail para mejor performance
        const step = Math.max(1, Math.floor(mouseTrail.length / 15)); // Máximo 15 puntos

        for (let i = step; i < mouseTrail.length; i += step) {
          const prev = mouseTrail[i - step];
          const curr = mouseTrail[i];
          const normalizedPos = i / mouseTrail.length;

          // Calcular grosor dinámico
          const thickness = (1 - normalizedPos) * 6 + 1; // Reducido grosor máximo

          // Alternar colores con transición suave
          const colorPhase = normalizedPos * Math.PI * 3 + time * 2;
          const color = Math.sin(colorPhase) > 0 ? siteColors.blue : siteColors.pink;

          // Alpha que se desvanece gradualmente
          const baseAlpha = curr.life * 0.5;
          const distanceAlpha = (1 - normalizedPos) * 0.3;
          const alpha = Math.min(baseAlpha + distanceAlpha, 0.6);

          trailGraphics.lineStyle(thickness, color, alpha);
          trailGraphics.moveTo(prev.x, prev.y);
          trailGraphics.lineTo(curr.x, curr.y);
        }

        // Añadir menos puntos brillantes para performance
        for (let i = 0; i < mouseTrail.length; i += 6) { // Cada 6 puntos en vez de 3
          const point = mouseTrail[i];
          const sparkleRadius = point.life * 4 + Math.sin(time * 4 + i) * 1; // Más pequeños
          const sparkleAlpha = point.life * 0.4;
          const sparkleColor = i % 12 < 6 ? siteColors.lightBlue : siteColors.lightPink;

          trailGraphics.beginFill(sparkleColor, sparkleAlpha);
          trailGraphics.drawCircle(point.x, point.y, sparkleRadius);
          trailGraphics.endFill();
        }
      }
    };

    const cleanup = () => {
      if (app) {
        if (app._customCleanup) {
          app._customCleanup();
        }

        // Clean up reusable graphics objects
        if (backgroundGraphics) {
          backgroundGraphics.destroy();
          backgroundGraphics = null;
        }
        if (gradientGraphics) {
          gradientGraphics.destroy();
          gradientGraphics = null;
        }
        if (mouseEffectGraphics) {
          mouseEffectGraphics.destroy();
          mouseEffectGraphics = null;
        }
        if (tunnelGraphics) {
          tunnelGraphics.destroy();
          tunnelGraphics = null;
        }
        if (trailGraphics) {
          trailGraphics.destroy();
          trailGraphics = null;
        }

        app.destroy(true, true);
        app = null;
      }
    };

    onMounted(() => {
      initPixi();
    });

    onUnmounted(() => {
      cleanup();
    });

    return {
      pixiContainer
    };
  }
};
</script>

<style scoped>
.playground-view {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  cursor: crosshair;
}

.pixi-shader-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.pixi-shader-container:hover {
  cursor: pointer;
}
</style>
