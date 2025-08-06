<template>
  <div class="floating-menu">
    <!-- Keep your existing backdrop transition -->
    <transition name="fade">
      <div class="menu-backdrop" v-show="menuOpen" @click="toggleMenu"></div>
    </transition>

    <div class="menu-content">
      <div class="menu-items" :class="{ 'open': menuOpen }">
        <a href="#home" @click.prevent="navigateTo(1)" :class="{ 'active': currentSection === 1 }"
          :style="getMenuItemStyle(0)">Home</a>
        <a href="#portfolio" @click.prevent="navigateTo(2)" :class="{ 'active': currentSection === 2 }"
          :style="getMenuItemStyle(1)">Portafolio</a>
        <a href="#services" @click.prevent="navigateTo(3)" :class="{ 'active': currentSection === 3 }"
          :style="getMenuItemStyle(2)">Servicios</a>
        <a href="#contact" @click.prevent="navigateTo(4)" :class="{ 'active': currentSection === 4 }"
          :style="getMenuItemStyle(3)">Contacto</a>
      </div>

      <!-- Updated menu toggle with enhanced accessibility -->
      <div class="menu-toggle" @click="toggleMenu" :class="{ 'menu-open': menuOpen }" :style="getToggleStyle()"
        role="button" aria-label="Toggle menu" tabindex="0">
        <div class="menu-icon" :class="{ 'menu-open': menuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.floating-menu {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 9999;
  /* Increase z-index to be above fullPage.js elements */
}

.menu-content {
  position: relative;
  z-index: 10000;
  /* Even higher z-index */
}

/* Update the menu-toggle style to be diamond-shaped */
.menu-toggle {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  transform: rotate(45deg);
  /* Make it diamond */
  border-radius: 5px;
  /* Slightly rounded corners */
  position: relative;
  /* Added for better icon positioning */
}

.menu-toggle:hover {
  transform: rotate(45deg) scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.menu-toggle.menu-open {
  transform: rotate(225deg);
  /* 180 + 45 to keep diamond shape while rotating */
}

.menu-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 20px;
  height: 18px;
  transition: all 0.3s ease;
  transform: translate(-50%, -50%) rotate(-45deg);
  /* Counter-rotate to keep lines horizontal */
  position: absolute;
  top: 50%;
  left: 50%;
}

/* Ensure the spans are properly sized and spaced */
.menu-icon span {
  display: block;
  height: 2.5px;
  width: 100%;
  transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  border-radius: 3px;
  margin: 0;
  /* Reset any margin that might affect layout */
}

/* Add this style to control icon color - v-bind allows dynamic colors */
.menu-icon span {
  background-color: v-bind('menuColors.text');
}

.menu-icon.menu-open {
  transform: translate(-50%, -50%) rotate(-45deg);
  /* Keep the counter-rotation when open */
}

/* Keep only these adjusted versions */
.menu-icon.menu-open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
  width: 100%;
}

.menu-icon.menu-open span:nth-child(2) {
  opacity: 0;
  transform: translateX(15px);
}

.menu-icon.menu-open span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
  width: 100%;
}

/* Keep your existing menu items styles */
.menu-items {
  position: absolute;
  top: 75px;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;
  z-index: 1020;
}

/* Remaining styles unchanged */
.menu-items.open {
  pointer-events: auto;
}

.menu-items a {
  --p: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 25px;
  margin-bottom: 15px;
  text-decoration: none;
  font-weight: bold;
  min-width: 140px;
  min-height: 40px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(-20px) translateX(50px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  clip-path: polygon(var(--p) 0, 100% 0, calc(100% - var(--p)) 100%, 0 100%);
}

/* Gradient overlay effect */
.menu-items a::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  transform: translateX(-100%);
  transition: transform 0.4s ease;
  z-index: -1;
}

.menu-items a:hover::before {
  transform: translateX(200%);
}

.menu-items a:hover {
  background: rgba(0, 0, 0, 0.95);
  transform: translateY(0) translateX(-5px) scale(1.05);
}

.menu-items a.active {
  background: white;
  color: black;
}

.menu-items a.active:hover {
  background: white;
}

.menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 9990;
  /* High but below menu content */
  /* No more fixed animation here, we'll use Vue transitions */
}

/* Vue transition classes for fade effect */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, backdrop-filter 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

@media (max-width: 768px) {
  .menu-items a {
    min-width: 120px;
    padding: 10px 20px;
    --p: 15px;
    /* Smaller parallelogram effect on mobile */
  }
}

/* Add this to prevent fullPage navigation from capturing events when menu is open */
.menu-items.open~.fp-nav {
  pointer-events: none !important;
}
</style>

<script>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';

export default {
  emits: ['navigate'],
  props: {
    currentSection: {
      type: Number,
      default: 1
    }
  },
  setup(props, { emit }) {
    const menuOpen = ref(false);
    const animationDelay = 0.08;
    const isLogoA = ref(true);

    // Theme colors from palette
    const menuColors = computed(() => ({
      background: isLogoA.value ? '#3030D0' : '#FF97D6',
      text: isLogoA.value ? '#FFFFFF' : '#3030D0'
    }));

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;

      // If menu is opened, temporarily disable fullPage scrolling
      if (menuOpen.value) {
        if (window.fullpage_api) {
          window.fullpage_api.setAllowScrolling(false);
        }
      } else {
        // Re-enable scrolling when menu is closed
        nextTick(() => {
          if (window.fullpage_api) {
            window.fullpage_api.setAllowScrolling(true);
          }
        });
      }
    };

    // Dynamic styles for menu items with theme color
    const getMenuItemStyle = (index) => {
      const baseStyle = {
        backgroundColor: menuColors.value.background,
        color: menuColors.value.text
      };

      if (menuOpen.value) {
        return {
          ...baseStyle,
          opacity: '1',
          transform: 'translateY(0) translateX(0)',
          transition: `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${animationDelay * index}s`
        };
      } else {
        return {
          ...baseStyle,
          opacity: '0',
          transform: 'translateY(-20px) translateX(50px)',
          transition: `all 0.3s ease ${0.1 * (3 - index)}s`
        };
      }
    };

    // NEW FUNCTION: Style for the toggle button
    const getToggleStyle = () => {
      return {
        backgroundColor: menuColors.value.background,
        borderColor: menuColors.value.background
      };
    };

    // Icon color computed property
    const getIconColor = computed(() => {
      return menuColors.value.text;
    });

    // Enhanced navigation function to work better with fullPage
    const navigateTo = (sectionNumber) => {
      menuOpen.value = false;

      // Re-enable scrolling before navigation
      if (window.fullpage_api) {
        window.fullpage_api.setAllowScrolling(true);
      }

      // Small delay to ensure menu is closed before navigating
      setTimeout(() => {
        emit('navigate', sectionNumber);
      }, 100);
    };

    // Keep your existing theme change handler
    const handleThemeChange = (event) => {
      const themeDetails = event.detail;

      if (themeDetails.background === '#3030D0' || themeDetails.background === '#FF4B00') {
        isLogoA.value = true;
      } else if (themeDetails.background === '#FF97D6' || themeDetails.background === '#00DEB5') {
        isLogoA.value = false;
      }
    };

    onMounted(() => {
      window.addEventListener('theme-change', handleThemeChange);

      // Add keyboard support for menu toggle
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen.value) {
          toggleMenu();
        }
      });
    });

    onUnmounted(() => {
      window.removeEventListener('theme-change', handleThemeChange);
      window.removeEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen.value) {
          toggleMenu();
        }
      });
    });

    return {
      menuOpen,
      toggleMenu,
      navigateTo,
      getMenuItemStyle,
      getToggleStyle,
      getIconColor,
      menuColors
    };
  }
}
</script>
