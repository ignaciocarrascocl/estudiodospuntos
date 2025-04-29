<template>
  <section id="portfolio" class="section" data-section="2" :style="sectionStyle">
    <div class="content">
      <h1>Portafolio</h1>
      <p>Nuestros proyectos más recientes</p>
      <div class="portfolio-grid">
        <div class="portfolio-item" v-for="i in 4" :key="i">
          <div class="portfolio-image">Proyecto {{ i }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'PortfolioView',
  setup() {
    // Default colors
    const sectionStyle = ref({
      backgroundColor: '#FF4B00',
      color: '#FF97D6'

    });

    const handleThemeChange = (event) => {
      // Only update if it's for this section
      if (event.detail.section === 2) {
        sectionStyle.value = {
          backgroundColor: event.detail.background,
          color: event.detail.text
        };
      }
    };

    onMounted(() => {
      window.addEventListener('theme-change', handleThemeChange);
    });

    onUnmounted(() => {
      window.removeEventListener('theme-change', handleThemeChange);
    });

    return {
      sectionStyle
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
  text-align: center;
  transition: background-color 0.5s, color 0.5s;
}

.content {
  max-width: 1000px;
  padding: 20px;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 2rem;
}

.portfolio-item {
  aspect-ratio: 16/9;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.portfolio-item:hover {
  transform: scale(1.05);
}

.portfolio-image {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>
