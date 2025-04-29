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
import { onMounted, onUnmounted, ref } from 'vue';
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

    const scrollToSection = (sectionNumber) => {
      if (isScrolling.value) return;

      isScrolling.value = true;
      currentSection.value = sectionNumber;

      // Dispatch an event that the logo can listen to
      window.dispatchEvent(new CustomEvent('section-change', {
        detail: { section: sectionNumber }
      }));

      // Use GSAP ScrollTo to create a scrolling effect
      gsap.to(sectionsContainer.value, {
        duration: 1,
        y: -((sectionNumber - 1) * window.innerHeight),
        ease: "power2.inOut",
        onComplete: () => {
          // Update URL with the section name instead of number
          const sectionNames = ['home', 'portfolio', 'services', 'contact'];
          history.pushState(null, null, `#${sectionNames[sectionNumber - 1]}`);
          isScrolling.value = false;
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

    const handleResize = () => {
      // Immediately update position without animation when window is resized
      gsap.set(sectionsContainer.value, {
        y: -((currentSection.value - 1) * window.innerHeight)
      });
    };

    onMounted(() => {
      // Set up event listeners
      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', handleResize);

      // Handle direct URL navigation with hash
      if (window.location.hash) {
        const sectionNames = ['home', 'portfolio', 'services', 'contact'];
        const section = window.location.hash.replace('#', '');
        const sectionNumber = sectionNames.indexOf(section) + 1;

        if (sectionNumber >= 1 && sectionNumber <= totalSections) {
          // Set initial position without animation
          gsap.set(sectionsContainer.value, {
            y: -((sectionNumber - 1) * window.innerHeight)
          });
          currentSection.value = sectionNumber;
        }
      }
    });

    onUnmounted(() => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
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
  font-family: 'Poppins', 'Arial', sans-serif;
}

body {
  overflow: hidden;
  touch-action: none;
}

.app-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.sections-container {
  width: 100%;
  position: relative;
  height: 100vh;
  will-change: transform;
}
</style>
