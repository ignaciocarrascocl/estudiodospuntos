<template>
  <section id="home" class="section" data-section="1" :style="sectionStyle">
    <div class="content">
      <LogoDP :current-section="currentSection" />
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import LogoDP from '@/components/LogoDP.vue';

export default {
  name: 'HomeView',
  components: {
    LogoDP
  },
  props: {
    currentSection: {
      type: Number,
      default: 1
    }
  },
  setup() {
    // Default colors
    const sectionStyle = ref({
      backgroundColor: '#3030D0',
      color: '#FF97D6'
    });

    const handleThemeChange = (event) => {
      // Only update if it's for this section
      if (event.detail.section === 1) {
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
  max-width: 800px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  margin-top: 2rem;
  font-weight: 700;
}

p {
  font-size: 1.8rem;
  margin-bottom: 2rem;
}
</style>
