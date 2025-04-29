<template>
  <div class="floating-menu">
    <!-- Use v-show instead of v-if to allow exit animations -->
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

      <div class="menu-toggle" @click="toggleMenu" :class="{ 'menu-open': menuOpen }">
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
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.menu-content {
  position: relative;
  z-index: 1010;
  /* Higher than backdrop */
}

.menu-toggle {
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

.menu-toggle:hover {
  transform: scale(1.05);
  background: black;
}

.menu-toggle.menu-open {
  transform: rotate(180deg);
  background: white;
}

.menu-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  transition: all 0.3s ease;
}

.menu-icon span {
  display: block;
  height: 3px;
  width: 100%;
  background: white;
  transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
  border-radius: 3px;
}

.menu-icon.menu-open span {
  background: black;
}

.menu-icon.menu-open span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 5px);
}

.menu-icon.menu-open span:nth-child(2) {
  opacity: 0;
  transform: translateX(15px);
}

.menu-icon.menu-open span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -5px);
}

.menu-items {
  position: absolute;
  bottom: 75px;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;
  z-index: 1020;
  /* Highest z-index to stay on top */
}

.menu-items.open {
  pointer-events: auto;
}

.menu-items a {
  display: block;
  padding: 12px 25px;
  margin-bottom: 15px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-decoration: none;
  font-weight: bold;
  min-width: 140px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: skew(20deg) translateX(50px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* Fix the text inside the parallelogram to remain normal */
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
  transform: skew(20deg) translateX(-5px) scale(1.05);
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
  z-index: 990;
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
  }
}
</style>

<script>
import { ref } from 'vue';

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
    const animationDelay = 0.08; // Delay between each menu item in seconds

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    // Dynamic styles for staggered animation
    const getMenuItemStyle = (index) => {
      if (menuOpen.value) {
        return {
          opacity: '1',
          transform: 'translateX(0)',
          transition: `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${animationDelay * index}s`
        };
      } else {
        return {
          opacity: '0',
          transform: 'translateX(50px)',
          transition: `all 0.3s ease ${0.1 * (3 - index)}s`
        };
      }
    };

    const navigateTo = (sectionNumber) => {
      menuOpen.value = false;

      // Use the parent's scrollToSection method
      emit('navigate', sectionNumber);

      // Alternative direct approach
      const event = new CustomEvent('navigate-to-section', {
        detail: { section: sectionNumber }
      });
      window.dispatchEvent(event);
    };

    return {
      menuOpen,
      toggleMenu,
      navigateTo,
      getMenuItemStyle
    };
  }
}
</script>
