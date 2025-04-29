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

    const updateSectionPositions = () => {
      // Asegurarse de que las posiciones estén actualizadas incluso después de cambios de orientación
      if (!sectionsContainer.value) return;

      const height = getVisibleHeight();

      // Aplicar altura a cada sección
      const sections = sectionsContainer.value.children;
      for (let i = 0; i < sections.length; i++) {
        sections[i].style.height = `${height}px`;
      }

      // Actualizar posición actual
      gsap.set(sectionsContainer.value, {
        y: -((currentSection.value - 1) * height)
      });
    };

    const scrollToSection = (sectionNumber) => {
      if (isScrolling.value) return;

      isScrolling.value = true;
      currentSection.value = sectionNumber;

      // Dispatch an event that the logo can listen to
      window.dispatchEvent(new CustomEvent('section-change', {
        detail: { section: sectionNumber }
      }));

      // Obtener altura actualizada
      const height = getVisibleHeight();

      // Use GSAP ScrollTo to create a scrolling effect with calculated height
      gsap.to(sectionsContainer.value, {
        duration: 1,
        y: -((sectionNumber - 1) * height),
        ease: "power2.inOut",
        onComplete: () => {
          // Update URL with the section name instead of number
          const sectionNames = ['home', 'portfolio', 'services', 'contact'];
          history.pushState(null, null, `#${sectionNames[sectionNumber - 1]}`);
          isScrolling.value = false;

          // Verificar si la posición es correcta y ajustar si es necesario
          nextTick(() => {
            const expectedY = -((sectionNumber - 1) * getVisibleHeight());
            const currentY = gsap.getProperty(sectionsContainer.value, "y");

            if (Math.abs(expectedY - currentY) > 5) {
              gsap.set(sectionsContainer.value, { y: expectedY });
            }
          });
        }
      });
    };

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

    const handleTouchEnd = (e) => {
      if (isScrolling.value) return;

      touchEndY = e.changedTouches[0].clientY;
      const touchDistance = touchEndY - touchStartY;

      // Evitar múltiples eventos de deslizamiento consecutivos
      if (touchTimeout) {
        clearTimeout(touchTimeout);
      }

      touchTimeout = setTimeout(() => {
        // Si el deslizamiento fue lo suficientemente largo
        if (Math.abs(touchDistance) > minTouchDistance) {
          if (touchDistance < 0 && currentSection.value < totalSections) {
            // Deslizamiento hacia arriba, mostrar siguiente sección
            scrollToSection(currentSection.value + 1);
          } else if (touchDistance > 0 && currentSection.value > 1) {
            // Deslizamiento hacia abajo, mostrar sección anterior
            scrollToSection(currentSection.value - 1);
          }
        }
      }, 50);
    };

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

        // Dar más tiempo para que se complete el cambio de orientación
        orientationTimeout = setTimeout(() => {
          updateSectionPositions();
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
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  width: 100%;
  font-family: 'Montserrat', sans-serif;
}

/* Resto de estilos sin cambios */
</style>
