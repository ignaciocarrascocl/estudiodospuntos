<template>
  <section id="services" class="section" data-section="3" :style="sectionStyle">
    <div class="content">
      <h1>Servicios</h1>
      <p>Lo que ofrecemos para tu proyecto</p>
      <div class="services-container">
        <div class="service-card" :style="cardStyle">
          <h3>Diseño Web</h3>
          <p>Creación de sitios web profesionales y responsivos</p>
        </div>
        <div class="service-card" :style="cardStyle">
          <h3>Desarrollo</h3>
          <p>Programación a medida para tus necesidades específicas</p>
        </div>
        <div class="service-card" :style="cardStyle">
          <h3>Branding</h3>
          <p>Diseño de identidad visual para tu marca</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';

export default {
  name: 'ServicesView',
  setup() {
    // Default colors
    const sectionStyle = ref({
      backgroundColor: '#3030D0',
      color: '#FF97D6'
    });

    // Compute card style based on section colors
    const cardStyle = computed(() => {
      return {
        backgroundColor: `${sectionStyle.value.color}20`, // 20% opacity of the text color
      };
    });

    const handleThemeChange = (event) => {
      // Only update if it's for this section
      if (event.detail.section === 3) {
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
      sectionStyle,
      cardStyle
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
  max-width: 900px;
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

.services-container {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 2rem;
}

.service-card {
  flex: 1;
  padding: 2rem;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-10px);
}

.service-card h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.service-card p {
  font-size: 1rem;
  line-height: 1.6;
}
</style>
