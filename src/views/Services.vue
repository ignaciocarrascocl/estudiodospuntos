<template>
  <!-- Remove the outer section tag - fullPage.js already provides a section container -->
  <div class="services-content" :style="sectionStyle">
    <div class="container">
      <div class="content px-4 py-5">
        <h1 class="text-4xl font-bold text-center mb-3" :style="{ color: sectionStyle.color }">Servicios</h1>
        <p class="text-xl text-center mb-5" :style="{ color: sectionStyle.color }">
          Impulsamos tu crecimiento con diseño estratégico y comunicación a medida.
        </p>

        <!-- Services slider using keen-slider -->
        <div class="services-slider-container">
          <div ref="container" class="keen-slider">
            <!-- Service 1: Identidad de Marca -->
            <div class="keen-slider__slide service-slide">
              <ServiceCard title="Identidad de Marca Estratégica"
                description="Creamos o revitalizamos la identidad visual de tu marca, desde el logotipo hasta la paleta de colores y la tipografía, asegurando que refleje tus valores y atraiga a tu público objetivo de alta rentabilidad."
                :accentColor="sectionStyle.color" icon="bi-palette-fill" />
            </div>

            <!-- Service 3: Materiales Corporativos -->
            <div class="keen-slider__slide service-slide">
              <ServiceCard title="Materiales Corporativos de Alto Impacto"
                description="Diseñamos y producimos materiales corporativos que transmiten calidad y coherencia con tu marca, desde tarjetas de presentación y papelería hasta presentaciones y folletos."
                :accentColor="sectionStyle.color" icon="bi-file-earmark-text" />
            </div>

            <!-- Service 4: Desarrollo Web -->
            <div class="keen-slider__slide service-slide">
              <ServiceCard title="Desarrollo de Plataformas Web Modernas"
                description="Desarrollamos sitios web a medida, optimizados para la experiencia del usuario, la accesibilidad y el rendimiento, convirtiéndose en una herramienta clave para la captación y fidelización de clientes."
                :accentColor="sectionStyle.color" icon="bi-laptop" />
            </div>

            <!-- Service 5: Presencia Online -->
            <div class="keen-slider__slide service-slide">
              <ServiceCard title="Gestión de Presencia y Reputación Online"
                description="Creamos y gestionamos estrategias de contenido para redes sociales, fortaleciendo tu presencia online, interactuando con tu audiencia y construyendo una reputación positiva."
                :accentColor="sectionStyle.color" icon="bi-share-fill" />
            </div>

            <!-- Service 6: Marketing de Contenidos -->
            <div class="keen-slider__slide service-slide">
              <ServiceCard title="Marketing de Contenidos de Valor"
                description="Desarrollamos contenido relevante y de valor para tu audiencia (artículos, guías, ebooks, etc.) que atrae, informa y posiciona a tu empresa como experta en su sector."
                :accentColor="sectionStyle.color" icon="bi-graph-up-arrow" />
            </div>
          </div>

          <!-- Navigation buttons -->
          <div class="slider-controls-container">
            <div class="slider-arrows">
              <button class="slider-arrow" @click="prevSlide" :disabled="currentSlideIndex === 0" :style="{
                color: sectionStyle.backgroundColor,
                backgroundColor: sectionStyle.color,
                opacity: currentSlideIndex === 0 ? '0.5' : '1'
              }">
                <i class="bi bi-chevron-left"></i>
              </button>

              <button class="slider-arrow" @click="nextSlide" :disabled="currentSlideIndex >= maxSlideIndex" :style="{
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
import ServiceCard from '@/components/ServiceCard.vue';
import KeenSlider from 'keen-slider';
import 'keen-slider/keen-slider.min.css';

export default {
  name: 'ServicesView',
  components: {
    ServiceCard
  },
  setup() {
    // Default colors
    const sectionStyle = ref({
      backgroundColor: '#3030D0',
      color: '#FF97D6'
    });

    // Create a ref for the slider
    const sliderInstance = ref(null);
    const container = ref(null);
    const currentSlideIndex = ref(0);
    const totalSlides = ref(6); // Total number of service cards

    // Compute the maximum slide index based on slider instance
    const maxSlideIndex = computed(() => {
      if (!sliderInstance.value) return 0;

      try {
        // This returns the maximum slide index that can be navigated to
        return sliderInstance.value.track.details.maxIdx || (totalSlides.value - 1);
      } catch (err) {
        console.error('Error calculating maxSlideIndex:', err);
        return totalSlides.value - 1;
      }
    });

    // Initialize the Keen Slider
    const initializeSlider = () => {
      try {
        if (!container.value) {
          return null;
        }

        const slidesPerView = getSlidesPerView();

        // Create the Keen Slider instance
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

    // Handler for section-change events (when navigating between sections)
    // REMOVED color-changing behavior from this handler
    const handleSectionChange = (event) => {
      // Now we only use this handler for other section-specific logic
      // that doesn't involve changing colors
      if (event.detail.section === 3) {
        // Any section-specific logic that doesn't involve colors
        // For example, you might want to pause/resume slider animations
        // or refresh content when returning to this section
      }
    };

    // Handler for theme-change events (when logo is clicked)
    // This is now the ONLY place where colors should change
    const handleThemeChange = (event) => {
      // Check if this event is for this section
      if (event.detail.section === 3) {
        sectionStyle.value = {
          backgroundColor: event.detail.background,
          color: event.detail.text
        };
      }
    };

    // Modified handler for window resize
    const handleResize = () => {
      if (sliderInstance.value) {
        try {
          // Update slides per view on resize
          const slidesPerView = getSlidesPerView();
          sliderInstance.value.options.slides.perView = slidesPerView;
          sliderInstance.value.update();
        } catch (err) {
          console.error('Error updating after resize:', err);
        }
      }
    };

    // Wait for fullPage.js to be initialized
    onMounted(() => {
      // Listen for both section-change and theme-change events
      window.addEventListener('section-change', handleSectionChange);
      window.addEventListener('theme-change', handleThemeChange);
      window.addEventListener('resize', handleResize);

      // Longer delay to ensure fullPage.js is initialized first
      setTimeout(() => {
        initializeSlider();
      }, 500); // Increased delay
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
      container,
      currentSlideIndex,
      totalSlides,
      nextSlide,
      prevSlide,
      maxSlideIndex
    };
  }
}
</script>

<style scoped>
/* Replace the section styling */
.services-content {
  width: 100%;
  height: 100%;
  transition: background-color 0.5s, color 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  /* Important - never let content overflow */
}

/* Override Bulma title colors to respect our dynamic theming */
.title,
.subtitle {
  color: inherit !important;
  transition: color 0.5s;
}

/* Services slider container */
.services-slider-container {
  position: relative;
  width: 100%;
  padding: 0 40px;
  max-width: 100%;
  margin: 0 auto;
}

/* Make each slide take consistent height without overflowing */
.service-slide {
  min-height: 350px;
  max-height: 450px;
  padding: 0 10px;
}

/* Make the ServiceCard take full height of its container */
.service-slide>>>.service-card {
  height: 100%;
}

/* Slider controls */
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
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.slider-arrow:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.slider-arrow:disabled {
  cursor: not-allowed;
}

/* Adjust for mobile */
@media screen and (max-width: 768px) {
  .services-content {
    padding-top: 1rem;
  }

  .content {
    padding: 1rem !important;
  }

  .services-slider-container {
    padding: 0 30px;
  }

  .service-slide {
    min-height: 300px;
    max-height: 400px;
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
