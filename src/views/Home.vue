<template>
  <section id="home" class="section" data-section="1" :style="sectionStyle">
    <!-- PixiBackground with higher default alpha for points -->
    <PixiBackground ref="pixiRef" />

    <!-- Content with proper z-index -->
    <div class="content">
      <LogoDP :current-section="currentSection" />

      <!-- Add some visual text to ensure we can see content layering -->
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import LogoDP from '@/components/LogoDP.vue';
import PixiBackground from '@/components/PixiBackground.vue';

export default {
  name: 'HomeView',
  components: {
    LogoDP,
    PixiBackground
  },
  props: {
    currentSection: {
      type: Number,
      default: 1
    }
  },
  setup() {
    const pixiRef = ref(null);

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

      // Log to verify Pixi is initialized
      console.log('Home component mounted, PixiBackground should initialize');
    });

    onUnmounted(() => {
      window.removeEventListener('theme-change', handleThemeChange);
    });

    return {
      sectionStyle,
      pixiRef
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
  position: relative;
  overflow: hidden;
}

.content {
  max-width: 800px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 10;
  /* Increased z-index to ensure it's above the background */
}

.title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  margin-top: 2rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.8rem;
  margin-bottom: 2rem;
}
</style>
