<template>
  <section id="portfolio" class="section" data-section="2" :style="sectionStyle">
    <div class="content">
      <h1 class="title is-1 has-text-centered">Portafolio</h1>
      <p class="subtitle is-4 has-text-centered">Nuestros proyectos más recientes</p>

      <!-- Loader mientras se cargan los proyectos -->
      <div v-if="loading" class="loader-container">
        <div class="loader" :style="{ borderTopColor: sectionStyle.color }"></div>
      </div>

      <div v-else-if="error" class="notification is-danger">
        {{ error }}
      </div>

      <!-- Contenedor horizontal scrollable -->
      <div v-else class="portfolio-horizontal-scroll">
        <div class="portfolio-inner">
          <!-- Items de portfolio -->
          <div
            v-for="project in portfolioItems"
            :key="project.id"
            class="portfolio-item"
          >
            <!-- Imagen -->
            <figure class="image is-5by3 mb-3">
              <img
                :src="project.featuredImage"
                :alt="project.title"
                @error="handleImageError"
              >
            </figure>

            <!-- Título del proyecto debajo de la imagen -->
            <div class="project-info">
              <h3 class="title is-5" :style="{ color: sectionStyle.color }">{{ project.title }}</h3>
              <p class="project-brief">{{ project.description }}</p>
              <a
                v-if="project.url"
                :href="project.url"
                target="_blank"
                class="button is-small mt-2"
                :style="{
                  backgroundColor: sectionStyle.color,
                  color: sectionStyle.backgroundColor
                }"
              >
                Ver proyecto
              </a>
            </div>
          </div>
        </div>

        <!-- Indicador de scroll -->
        <div class="scroll-indicator" :style="{ color: sectionStyle.color }">
          <span>→ Desliza para ver más</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { getPortfolioItems } from '@/services/contentfulService';

export default {
  name: 'PortfolioView',
  setup() {
    // Default colors
    const sectionStyle = ref({
      backgroundColor: '#FF4B00',
      color: '#FF97D6'
    });

    const portfolioItems = ref([]);
    const loading = ref(true);
    const error = ref(null);

    // Cargar proyectos desde Contentful
    const loadPortfolioItems = async () => {
      try {
        loading.value = true;
        error.value = null;
        portfolioItems.value = await getPortfolioItems();

        if (portfolioItems.value.length === 0) {
          error.value = "No se encontraron proyectos. ¡Agrega algunos en Contentful!";
        }
      } catch (err) {
        console.error('Error al cargar proyectos:', err);
        error.value = "No se pudieron cargar los proyectos. Por favor, intenta más tarde.";
      } finally {
        loading.value = false;
      }
    };

    const handleThemeChange = (event) => {
      // Only update if it's for this section
      if (event.detail.section === 2) {
        sectionStyle.value = {
          backgroundColor: event.detail.background,
          color: event.detail.text
        };
      }
    };

    // Manejar errores de carga de imágenes
    const handleImageError = (e) => {
      e.target.src = '/images/placeholder.jpg'; // Asegúrate de tener esta imagen
    };

    onMounted(() => {
      window.addEventListener('theme-change', handleThemeChange);
      loadPortfolioItems();
    });

    onUnmounted(() => {
      window.removeEventListener('theme-change', handleThemeChange);
    });

    return {
      sectionStyle,
      portfolioItems,
      loading,
      error,
      handleImageError
    };
  }
}
</script>

<style scoped>
section {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.5s, color 0.5s;
}

.content {
  width: 100%;
  padding: 20px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.title, .subtitle {
  transition: color 0.5s;
}

/* Contenedor scrollable horizontal */
.portfolio-horizontal-scroll {
  width: 100%;
  position: relative;
  padding-bottom: 30px; /* Espacio para el indicador de scroll */
}

.portfolio-inner {
  display: flex;
  overflow-x: auto;
  padding: 20px 0;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; /* Para dispositivos iOS */
  scrollbar-width: thin;
  scrollbar-color: var(--scroll-color, rgba(255, 255, 255, 0.3)) transparent;
  gap: 25px; /* Espacio entre proyectos */
}

/* Ocultar la barra de desplazamiento en Chrome/Safari */
.portfolio-inner::-webkit-scrollbar {
  height: 6px;
}

.portfolio-inner::-webkit-scrollbar-thumb {
  background-color: var(--scroll-color, rgba(255, 255, 255, 0.3));
  border-radius: 6px;
}

.portfolio-inner::-webkit-scrollbar-track {
  background: transparent;
}

/* Elementos de portfolio */
.portfolio-item {
  min-width: 300px;
  width: 300px;
  flex-shrink: 0;
  transition: transform 0.3s;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 8px;
}

.portfolio-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Estilo de imagen */
.image {
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

.portfolio-item:hover .image img {
  transform: scale(1.05);
}

/* Información del proyecto */
.project-info {
  padding: 10px 0;
  text-align: left;
}

.project-brief {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Indicador de scroll */
.scroll-indicator {
  position: absolute;
  bottom: 0;
  right: 20px;
  font-size: 0.9rem;
  opacity: 0.7;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 0.3; }
  100% { opacity: 0.7; }
}

/* Loader styles */
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.loader {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top-color: currentColor;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive para pantallas más pequeñas */
@media screen and (max-width: 768px) {
  .portfolio-item {
    min-width: 250px;
    width: 250px;
  }

  .content {
    padding: 10px;
  }

  .title.is-1 {
    font-size: 2rem;
  }

  .subtitle.is-4 {
    font-size: 1.2rem;
  }
}
</style>
