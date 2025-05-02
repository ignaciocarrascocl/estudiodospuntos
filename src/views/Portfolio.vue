<template>
  <div class="w-full h-full flex items-center justify-center overflow-hidden transition-colors duration-500"
    :style="sectionStyle">
    <div class="container mx-auto">
      <div class="px-3">
        <h1 class="text-4xl font-bold text-center mb-3" :style="{ color: sectionStyle.color }">Portafolio</h1>
        <p class="text-xl text-center mb-5" :style="{ color: sectionStyle.color }">
          Nuestros proyectos más recientes
        </p>

        <!-- Loader mientras se cargan los proyectos -->
        <div v-if="loading" class="flex justify-center items-center py-6">
          <div class="w-12 h-12 rounded-full border-4 border-opacity-20 animate-spin"
            :style="{ borderTopColor: sectionStyle.color }"></div>
        </div>

        <div v-else-if="error" class="bg-red-500 text-white p-4 rounded">
          {{ error }}
        </div>

        <!-- Keen Slider for Portfolio Items -->
        <div v-else class="relative w-full px-10 max-w-full mx-auto overflow-visible">
          <!-- Main slider -->
          <div ref="container" class="keen-slider">
            <div v-for="(project) in portfolioItems" :key="project.id"
              class="keen-slider__slide min-h-[350px] max-h-[450px] px-2.5 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 shadow-md flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-lg">
              <!-- Imagen -->
              <figure class="flex-none w-full rounded-md overflow-hidden shadow-md mb-3 aspect-[5/3]">
                <img :src="project.featuredImage" :alt="project.title" @error="handleImageError"
                  class="object-cover w-full h-full transition-transform duration-500 hover:scale-105">
              </figure>

              <!-- Project info -->
              <div class="flex-1 flex flex-col">
                <h3 class="text-xl font-semibold mb-3" :style="{ color: sectionStyle.color }">{{ project.title }}</h3>
                <p class="text-xs" :style="{ color: sectionStyle.color }">{{ project.description }}</p>
                <a v-if="project.url" :href="project.url" target="_blank"
                  class="mt-auto px-4 py-2 rounded text-sm transition-all duration-300 hover:shadow-md"
                  :style="{ backgroundColor: sectionStyle.color, color: sectionStyle.backgroundColor }">
                  Ver proyecto
                </a>
              </div>
            </div>
          </div>

          <!-- Navigation buttons -->
          <div v-if="portfolioItems.length > 1" class="flex justify-center mt-8 w-full">
            <div class="flex justify-center gap-5">
              <button
                class="flex items-center justify-center w-11 h-11 rounded-full border-none cursor-pointer transition-all duration-300 text-xl shadow-md hover:scale-110 active:scale-95"
                @click="prevSlide" :disabled="currentSlideIndex === 0" :style="{
                  color: sectionStyle.backgroundColor,
                  backgroundColor: sectionStyle.color,
                  opacity: currentSlideIndex === 0 ? '0.5' : '1'
                }">
                <i class="bi bi-chevron-left"></i>
              </button>

              <button
                class="flex items-center justify-center w-11 h-11 rounded-full border-none cursor-pointer transition-all duration-300 text-xl shadow-md hover:scale-110 active:scale-95"
                @click="nextSlide" :disabled="currentSlideIndex >= maxSlideIndex" :style="{
                  color: sectionStyle.backgroundColor,
                  backgroundColor: sectionStyle.color,
                  opacity: currentSlideIndex >= maxSlideIndex ? '0.5' : '1'
                }">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { getPortfolioItems } from '@/services/contentfulService';
import KeenSlider from 'keen-slider';
import 'keen-slider/keen-slider.min.css';

export default {
  name: 'PortfolioView',
  setup() {
    // Default colors - these will remain until changed by a theme-change event
    const sectionStyle = ref({
      backgroundColor: '#FF4B00',
      color: '#FFFFFF'
    });

    const portfolioItems = ref([]);
    const loading = ref(true);
    const error = ref(null);

    // Create a ref for the slider
    const sliderInstance = ref(null);
    const container = ref(null);
    const currentSlideIndex = ref(0);

    // Initialize the Keen Slider with settings that match Services
    const initializeSlider = () => {
      try {
        if (!container.value) {
          return null;
        }

        const slidesPerView = getSlidesPerView();

        // Create the Keen Slider instance with settings matching Services
        const keenSliderInstance = new KeenSlider(container.value, {
          loop: false,
          mode: "snap",
          slides: { perView: slidesPerView, spacing: 20 },
          dragSpeed: 1.5, // Make drag speed match Services
          duration: 1000,  // Longer animation duration like Services
          easing: (t) => t * (2 - t), // Smoother easing like Services
          created(slider) {
            sliderInstance.value = slider;
          },
          slideChanged(slider) {
            // Update the current slide index reactively
            currentSlideIndex.value = slider.track.details.rel;
          }
        });

        sliderInstance.value = keenSliderInstance;
        return keenSliderInstance;
      } catch (err) {
        console.error('Error initializing Keen Slider:', err);
        return null;
      }
    };

    // Determine how many slides to show based on screen width - match Services breakpoints
    const getSlidesPerView = () => {
      const width = window.innerWidth;
      if (width < 640) return 1;      // Mobile
      if (width < 1024) return 2;     // Tablet
      if (width < 1280) return 3;     // Small desktop
      return 4;                        // Large desktop
    };

    // Navigation functions - Add animation flags
    const nextSlide = () => {
      if (sliderInstance.value) {
        try {
          sliderInstance.value.next();
        } catch (err) {
          console.error('Error executing next():', err);
        }
      }
    };

    const prevSlide = () => {
      if (sliderInstance.value) {
        try {
          sliderInstance.value.prev();
        } catch (err) {
          console.error('Error executing prev():', err);
        }
      }
    };

    const loadPortfolioItems = async () => {
      try {
        loading.value = true;
        error.value = null;
        portfolioItems.value = await getPortfolioItems();

        if (portfolioItems.value.length === 0) {
          error.value = "No se encontraron proyectos. ¡Agrega algunos en Contentful!";
        } else {
          // Initialize slider immediately after items are loaded
          // Use a shorter timeout to match Services behavior
          setTimeout(() => {
            initializeSlider();
          }, 100);
        }
      } catch (err) {
        console.error('Error al cargar proyectos:', err);
        error.value = "No se pudieron cargar los proyectos. Por favor, intenta más tarde.";
      } finally {
        loading.value = false;
      }
    };

    // Handler for section-change events (when navigating between sections)
    // REMOVED color-changing behavior from this handler
    const handleSectionChange = (event) => {
      // Now we only use this handler for other section-specific logic
      // that doesn't involve changing colors
      if (event.detail.section === 2) {
        // Any section-specific logic that doesn't involve colors
        // For example, you might want to pause/resume slider animations
        // or refresh content when returning to this section
      }
    };

    // Handler for theme-change events (when logo is clicked)
    // This is now the ONLY place where colors should change
    const handleThemeChange = (event) => {
      // Check if this event is for this section
      if (event.detail.section === 2) {
        sectionStyle.value = {
          backgroundColor: event.detail.background,
          color: event.detail.text
        };
      }
    };

    const handleImageError = (e) => {
      e.target.src = '/images/placeholder.jpg';
    };

    // Improved resize handler to match Services behavior
    const handleResize = () => {
      if (sliderInstance.value) {
        // Destroy and recreate slider on resize for better consistency with Services
        try {
          sliderInstance.value.destroy();
        } catch (err) {
          console.error('Error destroying slider:', err);
        }

        // Short timeout to ensure DOM is ready
        setTimeout(() => {
          initializeSlider();
        }, 50);
      }
    };

    // Compute the maximum slide index
    const maxSlideIndex = computed(() => {
      if (!sliderInstance.value) return 0;

      try {
        // This gets the actual maximum index from the slider instance
        return sliderInstance.value.track.details.maxIdx || (portfolioItems.value.length - 1);
      } catch (err) {
        console.error('Error calculating maxSlideIndex:', err);
        return portfolioItems.value.length - 1;
      }
    });

    onMounted(() => {
      // Listen for both types of events
      window.addEventListener('section-change', handleSectionChange);
      window.addEventListener('theme-change', handleThemeChange);
      window.addEventListener('resize', handleResize);

      // Load portfolio items
      loadPortfolioItems();
    });

    onUnmounted(() => {
      // Clean up both event listeners
      window.removeEventListener('section-change', handleSectionChange);
      window.removeEventListener('theme-change', handleThemeChange);
      window.removeEventListener('resize', handleResize);

      // Destroy slider instance
      if (sliderInstance.value) {
        try {
          sliderInstance.value.destroy();
        } catch (err) {
          console.error('Error destroying slider:', err);
        }
      }
    });

    return {
      sectionStyle,
      portfolioItems,
      loading,
      error,
      handleImageError,
      container,
      currentSlideIndex,
      nextSlide,
      prevSlide,
      maxSlideIndex
    };
  }
}
</script>

<style>
/* Make styles consistent with Services component */
.keen-slider {
  display: flex;
  align-items: stretch;
  margin: 0 auto;
}

/* Add hover effects that match Services */
.keen-slider__slide {
  transition: transform 0.5s ease, box-shadow 0.5s ease !important;
}

.keen-slider__slide:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Loader animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Media query for adjustments on smaller screens */
@media (max-width: 768px) {
  .keen-slider {
    min-height: auto;
  }

  .keen-slider__slide {
    min-height: 300px !important;
    max-height: 380px !important;
  }
}
</style>
