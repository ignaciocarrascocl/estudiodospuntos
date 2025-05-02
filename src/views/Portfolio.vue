<template>
  <section id="portfolio" class="section is-fullheight is-flex is-align-items-center is-justify-content-center p-0"
    data-section="2" :style="sectionStyle">
    <div class="container">
      <div class="px-3">
        <h1 class="title is-2 has-text-centered mb-3" :style="{ color: sectionStyle.color }">Portafolio</h1>
        <p class="subtitle is-5 has-text-centered mb-5" :style="{ color: sectionStyle.color }">Nuestros proyectos
          más
          recientes
        </p>

        <!-- Loader mientras se cargan los proyectos -->
        <div v-if="loading" class="is-flex is-justify-content-center is-align-items-center py-6">
          <div class="loader" :style="{ borderTopColor: sectionStyle.color }"></div>
        </div>

        <div v-else-if="error" class="notification is-danger">
          {{ error }}
        </div>

        <!-- Keen Slider for Portfolio Items -->
        <div v-else class="portfolio-slider-container">
          <!-- Main slider -->
          <div ref="container" class="keen-slider">
            <div v-for="(project) in portfolioItems" :key="project.id"
              class="keen-slider__slide portfolio-item box light-card p-3">
              <!-- Imagen -->
              <figure class="image is-5by3 mb-3">
                <img :src="project.featuredImage" :alt="project.title" @error="handleImageError" class="has-ratio">
              </figure>

              <!-- Título del proyecto debajo de la imagen -->
              <div class="project-info">
                <h3 class="title is-size-5 mb-3" :style="{ color: sectionStyle.color }">{{ project.title }}</h3>
                <p class="subtitle is-size-7" :style="{ color: sectionStyle.color }">{{ project.description }}</p>
                <a v-if="project.url" :href="project.url" target="_blank" class="button is-small mt-3"
                  :style="{ backgroundColor: sectionStyle.color, color: sectionStyle.backgroundColor }">
                  Ver proyecto
                </a>
              </div>
            </div>
          </div>

          <!-- Navigation buttons -->
          <div v-if="portfolioItems.length > 1" class="slider-controls-container">
            <!-- Navigation arrows only - dot indicators removed -->
            <div class="slider-arrows">
              <button class="slider-arrow" @click="prevSlide" :disabled="currentSlideIndex === 0" :style="{
                color: sectionStyle.backgroundColor,
                backgroundColor: sectionStyle.color,
                opacity: currentSlideIndex === 0 ? '0.5' : '1'
              }">
                <i class="bi bi-chevron-left"></i>
              </button>

              <button class="slider-arrow" @click="nextSlide"
                :disabled="currentSlideIndex === portfolioItems.length - 1" :style="{
                  color: sectionStyle.backgroundColor,
                  backgroundColor: sectionStyle.color,
                  opacity: currentSlideIndex === portfolioItems.length - 1 ? '0.5' : '1'
                }">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { getPortfolioItems } from '@/services/contentfulService';
import KeenSlider from 'keen-slider';
import 'keen-slider/keen-slider.min.css';

export default {
  name: 'PortfolioView',
  setup() {
    // Default colors
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

    // Initialize the Keen Slider
    const initializeSlider = () => {
      try {
        if (!container.value) {
          return null;
        }

        const slidesPerView = getSlidesPerView();

        // Create the Keen Slider instance with consistent behavior
        const keenSliderInstance = new KeenSlider(container.value, {
          loop: false,
          mode: "snap",
          slides: { perView: slidesPerView, spacing: 20 },
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

    // Determine how many slides to show based on screen width
    const getSlidesPerView = () => {
      const width = window.innerWidth;
      if (width < 768) return 1;
      if (width < 1024) return 2;
      return 3;
    };

    // Navigation functions
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
          // Initialize slider after DOM updates with items
          setTimeout(() => {
            initializeSlider();
          }, 500); // Longer timeout to ensure DOM is ready
        }
      } catch (err) {
        console.error('Error al cargar proyectos:', err);
        error.value = "No se pudieron cargar los proyectos. Por favor, intenta más tarde.";
      } finally {
        loading.value = false;
      }
    };

    const handleThemeChange = (event) => {
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

    // Handler for window resize
    const handleResize = () => {
      if (sliderInstance.value) {
        setTimeout(() => {
          try {
            // Update slides per view on resize
            const slidesPerView = getSlidesPerView();
            sliderInstance.value.options.slides.perView = slidesPerView;
            sliderInstance.value.update();
          } catch (err) {
            console.error('Error updating after resize:', err);
          }
        }, 100);
      }
    };

    onMounted(() => {
      window.addEventListener('theme-change', handleThemeChange);
      window.addEventListener('resize', handleResize);

      // Load portfolio items
      loadPortfolioItems();
    });

    onUnmounted(() => {
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
      prevSlide
    };
  }
}
</script>

<style scoped>
section {
  width: 100%;
  height: 100vh;
  transition: background-color 0.5s, color 0.5s;
}

.subtitle,
.title {
  transition: color 0.5s;
  color: inherit !important;
}

/* Portfolio slider container - match Services styling */
.portfolio-slider-container {
  position: relative;
  width: 100%;
  padding: 0 40px;
  max-width: 100%;
  margin: 0 auto;
  overflow: visible;
}

/* Slider controls - match Services styling */
.slider-controls-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  width: 100%;
}

.slider-arrows {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.slider-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.25rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.slider-arrow:hover {
  transform: scale(1.1);
  opacity: 1;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.slider-arrow:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.slider-arrow:disabled {
  cursor: not-allowed;
}

/* Update keen-slider and portfolio-item styles */
.keen-slider {
  min-height: 450px;
  display: flex;
  align-items: stretch;
  margin: 0 auto;
}

.portfolio-item {
  height: 450px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
  backdrop-filter: blur(5px);
  border-radius: 8px;
  padding: 0 10px;
}

/* Image and content styles */
.image {
  flex: 0 0 auto;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.image img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
}

.project-info {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.project-info a.button {
  margin-top: auto;
}

/* Hover effects */
.portfolio-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.portfolio-item:hover .image img {
  transform: scale(1.05);
}

/* Loader styling */
.loader {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top-color: currentColor;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .content {
    padding: 1rem;
  }

  .portfolio-slider-container {
    padding: 0 30px;
  }

  .portfolio-item {
    height: 400px;
  }

  .slider-arrow {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
}

@media screen and (min-width: 1200px) {
  .slider-arrow {
    width: 50px;
    height: 50px;
    font-size: 1.4rem;
  }
}
</style>
