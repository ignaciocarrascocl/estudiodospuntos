<template>
  <div class="portfolio-content" :style="sectionStyle">
    <div class="container mx-auto">
      <div class="content px-4 py-8">
        <h1 class="text-4xl font-bold text-center mb-3" :style="{ color: sectionStyle.color }">Portafolio</h1>
        <p class="text-xl text-center mb-8" :style="{ color: sectionStyle.color }">
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

        <!-- Portfolio Grid -->
        <div v-else class="portfolio-grid">
          <div v-for="(project) in portfolioItems" :key="project.id"
            class="portfolio-item">
            <!-- Imagen -->
            <figure class="portfolio-image">
              <img :src="project.featuredImage" :alt="project.title" @error="handleImageError"
                class="object-cover w-full h-full transition-transform duration-500 hover:scale-105">
            </figure>

            <!-- Project info -->
            <div class="portfolio-content-area">
              <h3 class="portfolio-title" :style="{ color: sectionStyle.color }">{{ project.title }}</h3>
              <p class="portfolio-description" :style="{ color: sectionStyle.color }">{{ project.description }}</p>
              <a v-if="project.url" :href="project.url" target="_blank"
                class="portfolio-button"
                :style="{ backgroundColor: sectionStyle.color, color: sectionStyle.backgroundColor }">
                Ver proyecto
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
      color: '#FFFFFF'
    });

    const portfolioItems = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const loadPortfolioItems = async () => {
      try {
        loading.value = true;
        error.value = null;
        const items = await getPortfolioItems();

        // Sort by update date (newest first) - más recientes primero
        portfolioItems.value = items.sort((a, b) => {
          // Use updatedAt first, then createdAt as fallback
          const dateA = new Date(a.sys?.updatedAt || a.sys?.createdAt || a.updatedAt || a.createdAt || a.publishedAt || 0);
          const dateB = new Date(b.sys?.updatedAt || b.sys?.createdAt || b.updatedAt || b.createdAt || b.publishedAt || 0);

          return dateB - dateA; // Descending order (newest first)
        });

        // Force re-render by creating new array
        portfolioItems.value = [...portfolioItems.value];


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

    // Handler for theme-change events (when logo is clicked)
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
.portfolio-content {
  width: 100%;
  min-height: 100vh;
  transition: background-color 0.5s, color 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2rem 0;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 0 auto;
  max-width: 1200px;
}

.portfolio-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.portfolio-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.portfolio-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.portfolio-content-area {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.portfolio-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.portfolio-description {
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.portfolio-button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  margin-top: auto;
}

.portfolio-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Tablet adjustments */
@media screen and (max-width: 1024px) {
  .portfolio-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    max-width: 800px;
  }
}

/* Mobile adjustments */
@media screen and (max-width: 768px) {
  .portfolio-content {
    padding: 1rem 0;
  }

  .portfolio-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    max-width: 400px;
  }

  .portfolio-item {
    padding: 1.25rem;
  }

  .portfolio-image {
    height: 180px;
  }

  .portfolio-title {
    font-size: 1.1rem;
  }

  .portfolio-description {
    font-size: 0.85rem;
  }
}

@media screen and (max-width: 480px) {
  .content {
    padding: 1rem !important;
  }

  .portfolio-grid {
    gap: 1rem;
  }

  .portfolio-item {
    padding: 1rem;
  }

  .portfolio-image {
    height: 160px;
  }
}
</style>
