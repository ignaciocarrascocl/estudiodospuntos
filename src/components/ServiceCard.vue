<template>
  <div class="service-card light-card box" :style="cardStyle" :class="{ 'is-hovered': isHovered }"
    @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div class="icon-container mb-4" :style="{ color: accentColor }">
      <i :class="iconClass"></i>
    </div>
    <h3 class="is-size-5 mb-3" :style="{ color: accentColor }">{{ title }}</h3>
    <p class="is-size-7" :style="{ color: accentColor }">{{ description }}</p>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'ServiceCard',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    accentColor: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'bi-star-fill'
    }
  },
  setup(props) {
    const isHovered = ref(false);

    const cardStyle = computed(() => {
      return {
        backgroundColor: `${props.accentColor}10`, // 10% opacity of the accent color
        borderColor: `${props.accentColor}40`, // 40% opacity border
        boxShadow: isHovered.value ? `0 10px 20px rgba(0, 0, 0, 0.15)` : `0 2px 5px rgba(0, 0, 0, 0.1)`,
        transform: isHovered.value ? 'translateY(-5px)' : 'none'
      };
    });

    const iconClass = computed(() => {
      return `bi ${props.icon} service-icon`;
    });

    return {
      cardStyle,
      isHovered,
      iconClass
    };
  }
}
</script>

<style scoped>
.service-card {
  height: 100%;
  padding: 1.5rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.icon-container {
  font-size: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  transition: transform 0.3s ease;
}

.is-hovered .icon-container {
  transform: scale(1.1);
}

.service-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

h3 {
  font-weight: 600;
  transition: color 0.3s ease;
}

p {
  font-size: 0.95rem;
  line-height: 1.6;
  flex-grow: 1;
}
</style>
