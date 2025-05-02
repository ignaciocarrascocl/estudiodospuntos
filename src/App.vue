<template>
  <div class="app-container">
    <!-- Navigation dots -->
    <div class="navigation-dots">
      <button v-for="n in 4" :key="n" @click="scrollToSection(n)" :class="{ active: currentSection === n }"
        class="nav-dot"></button>
    </div>

    <!-- Floating Menu Component -->
    <FloatingMenu :current-section="currentSection" @navigate="scrollToSection" />

    <!-- Sections container -->
    <div class="sections-container" ref="sectionsContainer">
      <!-- Home section with component -->
      <section id="home" class="section">
        <Home />
      </section>

      <!-- Portfolio section with component -->
      <section id="portfolio" class="section">
        <Portfolio />
      </section>

      <!-- Services section with component -->
      <section id="services" class="section">
        <Services />
      </section>

      <!-- Contact section with component -->
      <section id="contact" class="section">
        <Contact />
      </section>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue';
import Home from '@/views/Home.vue';
import Portfolio from '@/views/Portfolio.vue';
import Services from '@/views/Services.vue';
import Contact from '@/views/Contact.vue';
import FloatingMenu from '@/components/FloatingMenu.vue';

export default {
  components: {
    Home,
    Portfolio,
    Services,
    Contact,
    FloatingMenu
  },
  setup() {
    const currentSection = ref(1);
    const sectionsContainer = ref(null);
    const isScrolling = ref(false);
    let touchStartY = 0;
    let touchEndY = 0;
    let wheelTimeout = null;
    let touchTimeout = null;

    // Get the height of the viewport
    const getViewportHeight = () => {
      return window.innerHeight;
    }

    // Scroll to a specific section
    const scrollToSection = (sectionNumber) => {
      if (isScrolling.value) return;
      isScrolling.value = true;
      currentSection.value = sectionNumber;

      // Update URL hash without triggering scroll
      const sectionIds = ['home', 'portfolio', 'services', 'contact'];
      history.pushState(null, null, `#${sectionIds[sectionNumber - 1]}`);

      // Calculate the target scroll position
      const targetY = (sectionNumber - 1) * getViewportHeight();

      // Use smooth scrolling animation
      const duration = 500;
      const startY = sectionsContainer.value.scrollTop;
      const distance = targetY - startY;
      let startTime = null;

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;

        // Ease in-out function
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 0.5 * (1 - Math.cos(Math.PI * progress));

        sectionsContainer.value.scrollTop = startY + distance * easedProgress;

        if (elapsed < duration) {
          window.requestAnimationFrame(animation);
        } else {
          // Dispatch section change event
          window.dispatchEvent(
            new CustomEvent('section-change', {
              detail: { section: sectionNumber }
            })
          );

          // Reset isScrolling after animation completes
          setTimeout(() => {
            isScrolling.value = false;
          }, 100);
        }
      };

      window.requestAnimationFrame(animation);
    };

    // Handle mouse wheel events
    const handleWheel = (e) => {
      e.preventDefault();

      if (isScrolling.value) return;

      if (wheelTimeout) {
        clearTimeout(wheelTimeout);
      }

      wheelTimeout = setTimeout(() => {
        // Determine scroll direction
        const direction = e.deltaY > 0 ? 1 : -1;

        if (direction > 0 && currentSection.value < 4) {
          // Scroll down
          scrollToSection(currentSection.value + 1);
        } else if (direction < 0 && currentSection.value > 1) {
          // Scroll up
          scrollToSection(currentSection.value - 1);
        }
      }, 50);
    };

    // Handle touch events for mobile
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (isScrolling.value) return;

      touchEndY = e.changedTouches[0].clientY;
      const touchDistance = touchEndY - touchStartY;

      if (touchTimeout) {
        clearTimeout(touchTimeout);
      }

      touchTimeout = setTimeout(() => {
        // Minimum swipe distance (px)
        const minDistance = 50;

        if (Math.abs(touchDistance) >= minDistance) {
          // Swipe down
          if (touchDistance > 0 && currentSection.value > 1) {
            scrollToSection(currentSection.value - 1);
          }
          // Swipe up
          else if (touchDistance < 0 && currentSection.value < 4) {
            scrollToSection(currentSection.value + 1);
          }
        }
      }, 50);
    };

    // Check URL hash on load
    const checkHash = () => {
      const hash = window.location.hash.replace('#', '');
      const sectionIds = ['home', 'portfolio', 'services', 'contact'];
      const index = sectionIds.indexOf(hash);

      if (index !== -1) {
        currentSection.value = index + 1;
        // Use timeout to ensure DOM is ready
        setTimeout(() => {
          scrollToSection(index + 1);
        }, 100);
      }
    };

    // Listen for the navigate-to-section event from the Home component
    const handleNavigateToSection = (event) => {
      if (event.detail && event.detail.section) {
        scrollToSection(event.detail.section);
      }
    };

    // Setup event listeners
    onMounted(() => {
      // Force initial scroll position
      window.scrollTo(0, 0);

      // Check for URL hash
      checkHash();

      // Add event listeners
      if (sectionsContainer.value) {
        sectionsContainer.value.addEventListener('wheel', handleWheel, { passive: false });
        sectionsContainer.value.addEventListener('touchstart', handleTouchStart, { passive: true });
        sectionsContainer.value.addEventListener('touchend', handleTouchEnd, { passive: true });
      }

      // Handle window resize
      window.addEventListener('resize', () => {
        // Re-scroll to current section on resize
        scrollToSection(currentSection.value);
      });

      // Add listener for navigation from Home component
      window.addEventListener('navigate-to-section', handleNavigateToSection);
    });

    // Clean up event listeners
    onUnmounted(() => {
      if (sectionsContainer.value) {
        sectionsContainer.value.removeEventListener('wheel', handleWheel);
        sectionsContainer.value.removeEventListener('touchstart', handleTouchStart);
        sectionsContainer.value.removeEventListener('touchend', handleTouchEnd);
      }

      window.removeEventListener('resize', () => { });
      window.removeEventListener('navigate-to-section', handleNavigateToSection);

      if (wheelTimeout) clearTimeout(wheelTimeout);
      if (touchTimeout) clearTimeout(touchTimeout);
    });

    return {
      currentSection,
      sectionsContainer,
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
  overflow: hidden;
  height: 100%;
}

.app-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.sections-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
}

.section {
  width: 100%;
  height: 100vh;
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
}

.test-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: white;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.5rem;
}

/* Navigation dots */
.navigation-dots {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-dot.active {
  background-color: white;
  transform: scale(1.3);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .navigation-dots {
    right: 15px;
  }

  .nav-dot {
    width: 10px;
    height: 10px;
  }
}
</style>
