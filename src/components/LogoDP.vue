<template>
  <div class="logo-container" ref="logoContainer" :class="{ 'in-corner': isInCorner }">
    <div class="logo-wrapper">
      <img :src="currentLogo" alt="Estudio Dos Puntos Logo" class="logo-image" @click="handleLogoClick"
        @load="handleLogoLoad" :key="currentLogoKey" ref="logoRef" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import useThemeManagement from './composables/useThemeManagement';

export default {
  name: 'LogoDosPointos',
  props: {
    currentSection: {
      type: Number,
      default: 1
    }
  },
  setup(props) {
    // State variables
    const logoContainer = ref(null);
    const logoRef = ref(null);
    const isLogoA = ref(true);
    const currentLogoKey = ref(0);
    const isInCorner = ref(false);
    const currentLogo = ref('/images/logo-dp_a.png');

    // Flag to track if we're changing the logo
    const isChangingLogo = ref(false);

    // Get theme management functionality
    const {
      initializeSectionThemes,
      changeThemeColor
    } = useThemeManagement(isLogoA);

    // Enhanced logo positioning with unified animation
    const setupLogoPositioning = () => {
      if (!logoContainer.value) return;

      if (isInCorner.value) {
        // Position for corner (small size in top-left)
        logoContainer.value.style.position = 'fixed';
        logoContainer.value.style.top = '20px';
        logoContainer.value.style.left = '20px';
        logoContainer.value.style.width = '120px'; // Smaller size when in corner
        logoContainer.value.style.transform = 'translate(0, 0)';
      } else {
        // Position for center (large size in middle)
        logoContainer.value.style.position = 'fixed';
        logoContainer.value.style.top = '50%';
        logoContainer.value.style.left = '50%';
        logoContainer.value.style.width = '300px'; // Larger size when centered
        logoContainer.value.style.transform = 'translate(-50%, -50%)';
      }
    };

    // Move logo to corner in one smooth animation
    const moveLogoToCorner = () => {
      if (isInCorner.value) return;
      isInCorner.value = true;
      setupLogoPositioning();
    };

    // Move logo to center in one smooth animation
    const moveLogoToCenter = () => {
      if (!isInCorner.value) return;
      isInCorner.value = false;
      setupLogoPositioning();
    };

    // Handle window resize
    const handleResize = () => {
      setupLogoPositioning();
    };

    // Handle logo image load event
    const handleLogoLoad = () => {
      if (isChangingLogo.value) {
        isChangingLogo.value = false;
      }
    };

    // Combined click handler - now themes are tied directly to the logo version
    const handleLogoClick = () => {
      // Set flag that we're changing the logo
      isChangingLogo.value = true;

      // Let changeThemeColor toggle the logo state internally
      changeThemeColor(props.currentSection);

      // Update logo image
      currentLogo.value = isLogoA.value ? '/images/logo-dp_a.png' : '/images/logo-dp_b.png';
      currentLogoKey.value++; // Force re-render
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
      window.addEventListener('section-change', handleSectionChange);
      window.addEventListener('resize', handleResize);

      // Initialize section themes with fixed pairs
      initializeSectionThemes();

      // Setup initial logo positioning
      isInCorner.value = props.currentSection !== 1;
      setupLogoPositioning();
    });

    onUnmounted(() => {
      window.removeEventListener('section-change', handleSectionChange);
      window.removeEventListener('resize', handleResize);
    });

    return {
      logoContainer,
      logoRef,
      handleLogoClick,
      handleLogoLoad,
      currentLogo,
      currentLogoKey,
      isInCorner
    };
  }
}
</script>

<style scoped>
.logo-container {
  z-index: 1000;
  transition:
    width 0.6s cubic-bezier(0.25, 1, 0.5, 1),
    top 0.6s cubic-bezier(0.25, 1, 0.5, 1),
    left 0.6s cubic-bezier(0.25, 1, 0.5, 1),
    transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.logo-wrapper {
  width: 100%;
  height: 100%;
}

.logo-image {
  width: 100%;
  height: auto;
  cursor: pointer;
  transition: filter 0.3s ease;
}

.logo-image:hover {
  filter: brightness(1.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .logo-container:not(.in-corner) {
    width: 200px !important;
    /* Smaller logo on mobile when centered */
  }

  .logo-container.in-corner {
    width: 80px !important;
    /* Smaller logo on mobile when in corner */
  }
}
</style>
