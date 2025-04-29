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
import useLogoPosition from './composables/useLogoPosition';

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

    // Get logo positioning functionality with size animation
    const {
      setupLogoPositioning,
      moveLogoToCorner,
      moveLogoToCenter,
      handleResize
    } = useLogoPosition(
      logoContainer,
      logoRef,
      isInCorner
    );

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
      setupLogoPositioning();

      // Move logo to corner if not in first section
      if (props.currentSection !== 1) {
        isInCorner.value = true;
        setTimeout(() => setupLogoPositioning(), 100);
      }
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
  transition: width 0.6s ease;
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
</style>
