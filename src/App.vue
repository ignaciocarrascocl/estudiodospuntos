<template>
  <div class="app-container">
    <div class="sections-container" ref="sectionsContainer">
      <Home :current-section="currentSection" />
      <Portfolio />
      <Services />
      <Contact />
    </div>

    <FloatingMenu :current-section="currentSection" @navigate="scrollToSection" />
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import FloatingMenu from './components/FloatingMenu.vue';

// Import section components
import Home from './views/Home.vue';
import Portfolio from './views/Portfolio.vue';
import Services from './views/Services.vue';
import Contact from './views/Contact.vue';

gsap.registerPlugin(ScrollToPlugin);

export default {
  components: {
    FloatingMenu,
    Home,
    Portfolio,
    Services,
    Contact
  },
  setup() {
    const sectionsContainer = ref(null);
    const currentSection = ref(1);
    let isScrolling = ref(false);
    const totalSections = 4;

    // Variables para manejo de eventos táctiles
    let touchStartY = 0;
    let touchEndY = 0;
    const minTouchDistance = 50; // Distancia mínima para considerar un deslizamiento
    let touchTimeout = null;

    // Función para obtener la altura real de la ventana visible
    const getVisibleHeight = () => {
      // Usar innerHeight para la mayoría de los casos
      return window.innerHeight;
    };

    // Replace your existing updateSectionPositions function
    const updateSectionPositions = () => {
      if (!sectionsContainer.value) return;

      const height = getVisibleHeight();

      // Set explicit heights on each section
      const sections = sectionsContainer.value.children;
      for (let i = 0; i < sections.length; i++) {
        gsap.set(sections[i], {
          height: height,
          minHeight: height,
          maxHeight: height,
          overflow: 'hidden'
        });
      }

      // Force layout calculation
      document.body.offsetHeight;

      // Update container position with explicit calculation
      const targetY = -((currentSection.value - 1) * height);
      gsap.set(sectionsContainer.value, {
        y: targetY,
        height: height * totalSections
      });
    }

    // Update your scrollToSection function
    const scrollToSection = (sectionNumber) => {
      if (isScrolling.value) return;

      isScrolling.value = true;
      currentSection.value = sectionNumber;

      // Dispatch section change event
      window.dispatchEvent(new CustomEvent('section-change', {
        detail: { section: sectionNumber }
      }));

      // Update positions and calculate exact height
      updateSectionPositions();
      const height = getVisibleHeight();

      // Calculate exact target position
      const targetY = -((sectionNumber - 1) * height);

      // Start animation with proper easing and callbacks
      gsap.to(sectionsContainer.value, {
        duration: 1,
        y: targetY,
        ease: "power2.inOut",
        onUpdate: () => {
          // Force each frame to update correctly
          document.body.offsetHeight;
        },
        onComplete: () => {
          // Set final position explicitly to avoid fractional pixel issues
          gsap.set(sectionsContainer.value, { y: targetY });

          // Update URL
          const sectionNames = ['home', 'portfolio', 'services', 'contact'];
          history.pushState(null, null, `#${sectionNames[sectionNumber - 1]}`);

          // Allow scrolling again
          isScrolling.value = false;
        }
      });
    }

    const handleWheel = (e) => {
      e.preventDefault();

      if (isScrolling.value) return;

      if (e.deltaY > 0 && currentSection.value < totalSections) {
        // Scroll down
        scrollToSection(currentSection.value + 1);
      } else if (e.deltaY < 0 && currentSection.value > 1) {
        // Scroll up
        scrollToSection(currentSection.value - 1);
      }
    };

    const handleKeyDown = (e) => {
      if (isScrolling.value) return;

      if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentSection.value < totalSections) {
        e.preventDefault();
        scrollToSection(currentSection.value + 1);
      } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentSection.value > 1) {
        e.preventDefault();
        scrollToSection(currentSection.value - 1);
      }
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      // Prevenir el comportamiento por defecto para evitar el rebote/scroll nativo
      e.preventDefault();
    };

    // Improve your handleTouchEnd function
    const handleTouchEnd = (e) => {
      if (isScrolling.value) return;

      touchEndY = e.changedTouches[0].clientY;
      const touchDistance = touchEndY - touchStartY;

      if (touchTimeout) {
        clearTimeout(touchTimeout);
      }

      // Clear any lingering animations
      gsap.killTweensOf(sectionsContainer.value);

      touchTimeout = setTimeout(() => {
        // If swipe distance is sufficient
        if (Math.abs(touchDistance) > minTouchDistance) {
          if (touchDistance < 0 && currentSection.value < totalSections) {
            // Swipe up - go to next section
            scrollToSection(currentSection.value + 1);
          } else if (touchDistance > 0 && currentSection.value > 1) {
            // Swipe down - go to previous section
            scrollToSection(currentSection.value - 1);
          } else {
            // If at the edge but still swiping, reinforce current position
            updateSectionPositions();
          }
        } else {
          // Small movement - make sure we're properly positioned
          updateSectionPositions();
        }
      }, 50);
    }

    const handleResize = () => {
      // Esperar por un momento para que cualquier cambio de UI se estabilice
      if (resizeTimeout) clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        updateSectionPositions();
      }, 100);
    };

    let resizeTimeout = null;
    let orientationTimeout = null;

    onMounted(() => {
      // Set up event listeners
      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', handleResize);

      // Detectar cambios de orientación en dispositivos móviles
      window.addEventListener('orientationchange', () => {
        if (orientationTimeout) clearTimeout(orientationTimeout);

        // Immediately hide all content during transition
        if (sectionsContainer.value) {
          gsap.set(sectionsContainer.value, { autoAlpha: 0.5 });
        }

        // Wait for orientation change to complete
        orientationTimeout = setTimeout(() => {
          // Update visible height calculation
          const height = getVisibleHeight();

          // Force browser to recognize new dimensions
          window.scrollTo(0, 0);
          document.body.offsetHeight;

          // Update positions with new height
          updateSectionPositions();

          // Fade back in
          gsap.to(sectionsContainer.value, {
            autoAlpha: 1,
            duration: 0.3
          });
        }, 300);
      });

      // Agregar eventos táctiles para dispositivos móviles
      window.addEventListener('touchstart', handleTouchStart, { passive: false });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd, { passive: false });

      // Handle direct URL navigation with hash
      if (window.location.hash) {
        const sectionNames = ['home', 'portfolio', 'services', 'contact'];
        const section = window.location.hash.replace('#', '');
        const sectionNumber = sectionNames.indexOf(section) + 1;

        if (sectionNumber >= 1 && sectionNumber <= totalSections) {
          currentSection.value = sectionNumber;
        }
      }

      // Esperar a que todo se inicialice completamente
      nextTick(() => {
        // Esperar otro momento más para asegurar que las alturas sean correctas
        setTimeout(() => {
          updateSectionPositions();
        }, 100);
      });
    });

    onUnmounted(() => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);

      // Eliminar eventos táctiles
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      if (touchTimeout) clearTimeout(touchTimeout);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (orientationTimeout) clearTimeout(orientationTimeout);
    });

    return {
      sectionsContainer,
      currentSection,
      scrollToSection
    };
  }
}
</script>

<style>
/* Reset styles to override any Bulma defaults that might conflict */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden !important;
  /* Important to override Bulma */
  width: 100%;
  position: fixed;
  /* Prevent body scroll on mobile */
}

/* App container styles */
.app-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  /* Fix the container position */
  top: 0;
  left: 0;
}

/* Section container styles */
.sections-container {
  width: 100%;
  position: absolute;
  /* Change to absolute positioning */
  top: 0;
  left: 0;
  height: 100vh;
  /* Explicit height */
  will-change: transform;
  /* Optimize for animations */
  transform: translateZ(0);
  /* Force GPU acceleration */
}

/* Individual section styling */
.sections-container>* {
  width: 100%;
  height: 100vh !important;
  /* Force full height */
  min-height: 100vh !important;
  max-height: 100vh !important;
  position: relative;
  overflow: hidden;
  /* Hide overflow content */
  display: flex;
  flex-direction: column;
}

/* iOS Safari specific fix */
@supports (-webkit-touch-callout: none) {
  .sections-container>* {
    /* iOS devices need special height handling */
    height: -webkit-fill-available !important;
  }
}

/* Make sure Bulma doesn't limit our app width */
#app {
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  height: 100%;
}

/* Override Bulma's font variables */
:root {
  --bulma-body-family: 'Montserrat', sans-serif !important;
  --bulma-family-primary: 'Montserrat', sans-serif !important;
  --bulma-family-sans-serif: 'Montserrat', sans-serif !important;
}
</style>
