<template>
  <div class="app-container">
    <!-- Navigation dots -->
    <div class="navigation-dots">
      <button v-for="n in 6" :key="n" @click="scrollToSection(n)" :class="{ active: currentSection === n }"
        class="nav-dot"></button>
    </div>

    <!-- WhatsApp Button -->
    <a
      href="https://wa.me/56992659949?text=¡Hola!%20Me%20gustaría%20obtener%20más%20información%20sobre%20sus%20servicios."
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-button"
      aria-label="Contactar por WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.488"/>
      </svg>
    </a>

    <!-- Floating Menu Component -->
    <FloatingMenu :current-section="currentSection" @navigate="scrollToSection" />

    <!-- Sections container -->
    <div class="sections-container" ref="sectionsContainer" @scroll="handleScroll">
      <!-- Home section with component -->
      <section id="home" class="section" ref="homeSection">
        <Home />
      </section>

      <!-- Portfolio section with component -->
      <section id="portfolio" class="section" ref="portfolioSection">
        <Portfolio />
      </section>

      <!-- Breakout section with component -->
      <section id="breakout" class="section" ref="breakoutSection">
        <Breakout />
      </section>

      <!-- Services section with component -->
      <section id="services" class="section" ref="servicesSection">
        <Services />
      </section>

      <!-- Playground section with component -->
      <section id="playground" class="section" ref="playgroundSection">
        <Playground />
      </section>

      <!-- Contact section with component -->
      <section id="contact" class="section" ref="contactSection">
        <Contact />
      </section>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue';
import Home from '@/views/Home.vue';
import Portfolio from '@/views/Portfolio.vue';
import Breakout from '@/views/Breakout.vue';
import Services from '@/views/Services.vue';
import Playground from '@/views/Playground.vue';
import Contact from '@/views/Contact.vue';
import FloatingMenu from '@/components/FloatingMenu.vue';

export default {
  components: {
    Home,
    Portfolio,
    Breakout,
    Services,
    Playground,
    Contact,
    FloatingMenu
  },
  setup() {
    const currentSection = ref(1);
    const sectionsContainer = ref(null);
    const homeSection = ref(null);
    const portfolioSection = ref(null);
    const breakoutSection = ref(null);
    const servicesSection = ref(null);
    const playgroundSection = ref(null);
    const contactSection = ref(null);

    // Get section refs array
    const getSectionRefs = () => [
      homeSection.value,
      portfolioSection.value,
      breakoutSection.value,
      servicesSection.value,
      playgroundSection.value,
      contactSection.value
    ];

    // Handle scroll events to update current section
    const handleScroll = () => {
      if (!sectionsContainer.value) return;

      const scrollTop = sectionsContainer.value.scrollTop;
      const containerHeight = sectionsContainer.value.clientHeight;
      const sections = getSectionRefs();

      // Find which section is currently most visible
      let currentSectionIndex = 0;
      let maxVisibleArea = 0;

      sections.forEach((section, index) => {
        if (!section) return;

        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;

        // Calculate visible area of this section
        const visibleTop = Math.max(scrollTop, sectionTop);
        const visibleBottom = Math.min(scrollTop + containerHeight, sectionBottom);
        const visibleArea = Math.max(0, visibleBottom - visibleTop);

        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          currentSectionIndex = index;
        }
      });

      const newSection = currentSectionIndex + 1;
      if (newSection !== currentSection.value) {
        currentSection.value = newSection;

        // Update URL hash
        const sectionIds = ['home', 'portfolio', 'breakout', 'services', 'playground', 'contact'];
        history.pushState(null, null, `#${sectionIds[currentSectionIndex]}`);

        // Dispatch section change event
        window.dispatchEvent(
          new CustomEvent('section-change', {
            detail: { section: newSection }
          })
        );
      }
    };

    // Scroll to a specific section
    const scrollToSection = (sectionNumber) => {
      const sections = getSectionRefs();
      const targetSection = sections[sectionNumber - 1];

      if (targetSection && sectionsContainer.value) {
        sectionsContainer.value.scrollTo({
          top: targetSection.offsetTop,
          behavior: 'smooth'
        });
      }
    };

    // Check URL hash on load
    const checkHash = () => {
      const hash = window.location.hash.replace('#', '');
      const sectionIds = ['home', 'portfolio', 'breakout', 'services', 'playground', 'contact'];
      const index = sectionIds.indexOf(hash);

      if (index !== -1) {
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
      // Check for URL hash
      checkHash();

      // Add listener for navigation from Home component
      window.addEventListener('navigate-to-section', handleNavigateToSection);

      // Initial scroll position check
      setTimeout(() => {
        handleScroll();
      }, 100);
    });

    // Clean up event listeners
    onUnmounted(() => {
      window.removeEventListener('navigate-to-section', handleNavigateToSection);
    });

    return {
      currentSection,
      sectionsContainer,
      homeSection,
      portfolioSection,
      breakoutSection,
      servicesSection,
      playgroundSection,
      contactSection,
      scrollToSection,
      handleScroll
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
}

.app-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.sections-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.section {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
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

/* WhatsApp Button */
.whatsapp-button {
  position: fixed;
  bottom: 30px;
  left: 30px;
  width: 60px;
  height: 60px;
  background-color: #25d366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  text-decoration: none;
  color: white;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
  transition: all 0.3s ease;
  animation: whatsapp-pulse 2s infinite;
}

.whatsapp-button:hover {
  background-color: #128c7e;
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
}

.whatsapp-button svg {
  width: 32px;
  height: 32px;
}

@keyframes whatsapp-pulse {
  0% {
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
  }
  50% {
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4), 0 0 0 10px rgba(37, 211, 102, 0.1);
  }
  100% {
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
  }
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

  .whatsapp-button {
    bottom: 20px;
    left: 20px;
    width: 50px;
    height: 50px;
  }

  .whatsapp-button svg {
    width: 26px;
    height: 26px;
  }
}
</style>
