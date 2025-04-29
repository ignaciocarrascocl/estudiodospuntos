<template>
  <div class="logo-container" ref="logoContainer" :class="{ 'in-corner': isInCorner }">
    <div class="logo-wrapper">
      <!-- Logo A -->
      <img
        src="/images/logo-dp_a.png"
        alt="Estudio Dos Puntos Logo"
        class="logo-image"
        :style="{ opacity: isLogoA ? 1 : 0, visibility: isLogoA ? 'visible' : 'hidden' }"
        @click="handleLogoClick"
        ref="logoRefA"
        draggable="false"
      />
      <!-- Logo B -->
      <img
        src="/images/logo-dp_b.png"
        alt="Estudio Dos Puntos Logo"
        class="logo-image"
        :style="{ opacity: !isLogoA ? 1 : 0, visibility: !isLogoA ? 'visible' : 'hidden' }"
        @click="handleLogoClick"
        ref="logoRefB"
        draggable="false"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import useThemeManagement from './composables/useThemeManagement';
import useLogoPosition from './composables/useLogoPosition';

export default {
  name: 'FloatingMenu',
  props: {
    currentSection: {
      type: Number,
      default: 1
    }
  },
  emits: ['navigate'],
  setup(props, { emit }) {
    // State variables
    const logoContainer = ref(null);
    const logoRefA = ref(null);
    const logoRefB = ref(null);
    const isLogoA = ref(true);
    const isInCorner = ref(false);

    // Computed property to always point to the currently visible logo
    const activeLogo = computed(() => isLogoA.value ? logoRefA.value : logoRefB.value);

    // Get theme management functionality
    const {
      initializeSectionThemes,
      changeThemeColor
    } = useThemeManagement(isLogoA);

    // Get logo positioning functionality - CRITICAL: Pass the activeLogo computed ref
    const {
      setupLogoPositioning,
      moveLogoToCorner,
      moveLogoToCenter,
      handleResize,
      maintainLogoSize
    } = useLogoPosition(
      logoContainer,
      activeLogo,
      isInCorner
    );

    // Función para cambiar el logo sin parpadeo
    const handleLogoClick = () => {
      // Si estamos en esquina, navegar a la sección 1
      if (isInCorner.value) {
        emit('navigate', 1);
      } else {
        // Importante: Capturar el tamaño actual antes de cualquier cambio
        const currentSize = activeLogo.value?.style.width || '100%';

        // Aplicar el mismo tamaño a ambos logos antes del cambio
        logoRefA.value.style.width = currentSize;
        logoRefB.value.style.width = currentSize;

        // Cambiar el tema (esto cambiará isLogoA.value)
        changeThemeColor(props.currentSection);

        // Asegurar que el tamaño se mantiene después del cambio
        setTimeout(() => {
          maintainLogoSize();
        }, 10);
      }
    };

    // Watch for section changes
    const handleSectionChange = (event) => {
      const sectionNumber = event.detail?.section || props.currentSection;

      // Position the logo based on current section
      if (sectionNumber === 1) {
        moveLogoToCenter();
      } else {
        moveLogoToCorner();
      }
    };

    // Setup and cleanup
    onMounted(() => {
      // Establecer el tamaño inicial de ambos logos
      logoRefA.value.style.width = '100%';
      logoRefB.value.style.width = '100%';

      // Asegurar que el logo inactivo está completamente oculto desde el inicio
      if (isLogoA.value) {
        logoRefB.value.style.visibility = 'hidden';
      } else {
        logoRefA.value.style.visibility = 'hidden';
      }

      window.addEventListener('section-change', handleSectionChange);
      window.addEventListener('resize', handleResize);

      // Initialize section themes
      initializeSectionThemes();

      // Setup initial logo positioning
      if (props.currentSection !== 1) {
        isInCorner.value = true;
      }

      // Ensure proper initial positioning after DOM is fully rendered
      setTimeout(() => {
        setupLogoPositioning();
      }, 50);
    });

    onUnmounted(() => {
      window.removeEventListener('section-change', handleSectionChange);
      window.removeEventListener('resize', handleResize);
    });

    return {
      logoContainer,
      logoRefA,
      logoRefB,
      handleLogoClick,
      isLogoA,
      isInCorner
    };
  }
}
</script>

<style scoped>
.logo-container {
  position: fixed;
  z-index: 100;
  width: 100px; /* Default width */
}

.logo-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; /* Ambas imágenes ocupan el 100% del contenedor */
  height: auto;
  cursor: pointer;
  user-select: none;
  /* Eliminar transiciones para evitar efectos de superposición */
}
</style>
