<template>
  <section id="contact" class="section" data-section="4" :style="sectionStyle">
    <div class="content">
      <h1>Contacto</h1>
      <p>¡Comencemos a trabajar juntos!</p>

      <div class="contact-form">
        <div class="form-group">
          <input type="text" placeholder="Nombre" class="form-control" :style="inputStyle">
        </div>
        <div class="form-group">
          <input type="email" placeholder="Email" class="form-control" :style="inputStyle">
        </div>
        <div class="form-group">
          <textarea placeholder="Mensaje" class="form-control textarea" :style="inputStyle"></textarea>
        </div>
        <button class="submit-btn" :style="buttonStyle">Enviar</button>
      </div>

      <div class="contact-info">
        <p>info@estudiodospuntos.com</p>
        <p>+34 600 000 000</p>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';

export default {
  name: 'ContactPage',
  setup() {
    // Default colors
    const sectionStyle = ref({
      backgroundColor: '#FFFFFF',
      color: '#3030D0'
    });

    // Style for form inputs based on section colors
    const inputStyle = computed(() => {
      return {
        backgroundColor: `${sectionStyle.value.color}20`,
        color: sectionStyle.value.color,
        borderColor: sectionStyle.value.color
      };
    });

    // Style for button
    const buttonStyle = computed(() => {
      return {
        backgroundColor: sectionStyle.value.color,
        color: sectionStyle.value.backgroundColor
      };
    });

    const handleThemeChange = (event) => {
      // Only update if it's for this section
      if (event.detail.section === 4) {
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
      inputStyle,
      buttonStyle
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
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
  text-align: left;
}

.form-control {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.5s, color 0.5s;
}

.form-control::placeholder {
  opacity: 0.7;
}

.textarea {
  min-height: 120px;
  resize: vertical;
}

.submit-btn {
  border: none;
  padding: 0.8rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
}

.submit-btn:hover {
  transform: translateY(-3px);
}

.contact-info {
  margin-top: 2rem;
}

.contact-info p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}
</style>
