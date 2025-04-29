<template>
  <section id="contact" class="section" data-section="4" :style="sectionStyle">
    <div class="content">
      <h1 class="title" :style="titleStyle">Contacto</h1>
      <p class="subtitle">¡Demos vida a tus ideas!</p>

      <form class="contact-form" action="https://formsubmit.co/icarrasco@caput.cl" method="POST" @submit="handleSubmit">
        <div class="form-group form-floating">
          <input
            type="text"
            name="name"
            id="name"
            required
            v-model="formData.name"
            class="form-control"
            :class="{'filled': formData.name}"
            :style="inputStyle"
          >
          <label for="name" :style="labelStyle">Nombre</label>
          <div class="form-indicator" :style="indicatorStyle"></div>
        </div>

        <div class="form-group form-floating">
          <input
            type="email"
            name="email"
            id="email"
            required
            v-model="formData.email"
            class="form-control"
            :class="{'filled': formData.email}"
            :style="inputStyle"
          >
          <label for="email" :style="labelStyle">Email</label>
          <div class="form-indicator" :style="indicatorStyle"></div>
        </div>

        <div class="form-group form-floating">
          <textarea
            name="message"
            id="message"
            required
            v-model="formData.message"
            class="form-control textarea"
            :class="{'filled': formData.message}"
            :style="inputStyle"
          ></textarea>
          <label for="message" :style="labelStyle">Mensaje</label>
          <div class="form-indicator" :style="indicatorStyle"></div>
        </div>

        <!-- Campos ocultos para FormSubmit -->
        <input type="hidden" name="_subject" value="¡Nuevo contacto desde Estudio Dos Puntos!">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_captcha" value="false">
        <input type="hidden" name="_next" value="https://estudiodospuntos.cl/">

        <button
          type="submit"
          class="submit-btn"
          :style="buttonStyle"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Enviar</span>
          <span v-else class="loader" :style="loaderStyle"></span>
        </button>

        <div v-if="formStatus" class="form-status" :class="formStatus.type">
          {{ formStatus.message }}
        </div>
      </form>

      <div class="contact-info">
        <div class="info-item">
          <svg class="info-icon" :style="iconStyle" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
          </svg>
          <p>info@estudiodospuntos.com</p>
        </div>
        <div class="info-item">
          <svg class="info-icon" :style="iconStyle" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z"/>
          </svg>
          <p>+34 600 000 000</p>
        </div>
        <div class="social-media">
          <a href="https://instagram.com" target="_blank" class="social-icon-link" :style="iconLinkStyle">
            <svg class="social-icon" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" class="social-icon-link" :style="iconLinkStyle">
            <svg class="social-icon" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.053 10.053 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" class="social-icon-link" :style="iconLinkStyle">
            <svg class="social-icon" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Decorative elements -->
    <div class="decoration-dots" aria-hidden="true">
      <div class="dot" v-for="i in 20" :key="i" :style="getDotStyle(i)"></div>
    </div>
    <div class="decoration-circle" :style="decorationCircleStyle" aria-hidden="true"></div>
  </section>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';

export default {
  name: 'ContactPage',
  setup() {
    // Form data
    const formData = ref({
      name: '',
      email: '',
      message: ''
    });

    const isSubmitting = ref(false);
    const formStatus = ref(null);

    // Default colors
    const sectionStyle = ref({
      backgroundColor: '#FFFFFF',
      color: '#3030D0'
    });

    // Enhanced styles with computed properties
    const titleStyle = computed(() => ({
      backgroundImage: `linear-gradient(135deg, ${sectionStyle.value.color}, ${adjustColor(sectionStyle.value.color, 40)})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }));

    const inputStyle = computed(() => ({
      backgroundColor: `${sectionStyle.value.color}10`,
      color: sectionStyle.value.color,
      borderColor: `${sectionStyle.value.color}30`
    }));

    const labelStyle = computed(() => ({
      color: `${sectionStyle.value.color}80`
    }));

    const indicatorStyle = computed(() => ({
      backgroundColor: sectionStyle.value.color
    }));

    const buttonStyle = computed(() => ({
      backgroundColor: sectionStyle.value.color,
      color: sectionStyle.value.backgroundColor,
      boxShadow: `0 4px 20px ${sectionStyle.value.color}50`
    }));

    const loaderStyle = computed(() => ({
      borderColor: `${sectionStyle.value.backgroundColor}30`,
      borderTopColor: sectionStyle.value.backgroundColor
    }));

    const iconStyle = computed(() => ({
      color: sectionStyle.value.color
    }));

    const iconLinkStyle = computed(() => ({
      color: sectionStyle.value.color,
      borderColor: `${sectionStyle.value.color}30`
    }));

    const decorationCircleStyle = computed(() => ({
      backgroundColor: `${sectionStyle.value.color}10`,
      borderColor: `${sectionStyle.value.color}20`
    }));

    // Helper function to adjust color brightness
    const adjustColor = (color, amount) => {
      if (color.startsWith('#')) {
        // If hex color
        const hex = color.slice(1);
        const num = parseInt(hex, 16);
        let r = (num >> 16) + amount;
        let g = ((num >> 8) & 0x00FF) + amount;
        let b = (num & 0x0000FF) + amount;

        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));

        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
      }
      return color; // Return original if not hex
    };

    // Random dot styles for decoration
    const getDotStyle = (i) => {
      const size = Math.random() * 8 + 4;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.3 + 0.1;

      return {
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}%`,
        left: `${left}%`,
        backgroundColor: sectionStyle.value.color,
        opacity: opacity,
        animationDelay: `${delay}s`
      };
    };

    // Form submission handler
    const handleSubmit = async (e) => {
      // FormSubmit will handle the actual submission
      // This is just for UX enhancements
      isSubmitting.value = true;
      formStatus.value = null;

      // We'll let the native form submission handle the actual sending
      // but we'll add a small delay for UX purposes
      setTimeout(() => {
        // Clearing form fields and status would normally be done after redirect
        // But for demo purposes we'll show success state
        formStatus.value = {
          type: 'success',
          message: 'Mensaje enviado correctamente. ¡Gracias por contactarnos!'
        };
        isSubmitting.value = false;

        // In a real implementation, FormSubmit would redirect to the _next URL
        // so this code would only run if something went wrong
        setTimeout(() => {
          formData.value = { name: '', email: '', message: '' };
          formStatus.value = null;
        }, 3000);
      }, 1500);
    };

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
      formData,
      isSubmitting,
      formStatus,
      sectionStyle,
      titleStyle,
      inputStyle,
      labelStyle,
      indicatorStyle,
      buttonStyle,
      loaderStyle,
      iconStyle,
      iconLinkStyle,
      decorationCircleStyle,
      getDotStyle,
      handleSubmit
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
  position: relative;
  z-index: 2;
}

.title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
  background-size: 200% auto;
  animation: shine 3s linear infinite;
}

.subtitle {
  font-size: 1.6rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

/* Animated form styling */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 500px;
  margin: 0 auto 1.5rem;
  text-align: left;
  position: relative;
}

.form-group {
  position: relative;
}

.form-floating {
  position: relative;
  height: auto;
}

.form-control {
  width: 100%;
  padding: 1.2rem 0.8rem 0.8rem;
  border: 1px solid;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background-color: transparent;
  position: relative;
  z-index: 2;
  outline: none;
}

.form-control:focus {
  border-color: currentColor;
  box-shadow: 0 0 0 3px rgba(var(--color-rgb), 0.2);
}

.form-floating label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 1rem 0.8rem;
  pointer-events: none;
  transform-origin: left top;
  transition: all 0.2s ease-out;
  opacity: 0.75;
  z-index: 1;
}

.form-control:focus + label,
.form-control.filled + label {
  transform: translateY(-30%) scale(0.85);
  opacity: 1;
}

.form-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: currentColor;
  transform: translateX(-50%);
  transition: width 0.3s;
  z-index: 3;
}

.form-control:focus ~ .form-indicator {
  width: calc(100% - 2px);
}

.textarea {
  min-height: 140px;
  resize: vertical;
}

.submit-btn {
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 56px;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: height 0.5s ease;
}

.submit-btn:hover {
  transform: translateY(-3px);
}

.submit-btn:hover::before {
  height: 150%;
}

.submit-btn:active {
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

/* Loader animation */
.loader {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

/* Form status messages */
.form-status {
  padding: 0.8rem;
  margin-top: 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
}

.form-status.success {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.form-status.error {
  background-color: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

/* Contact info styling */
.contact-info {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.info-item p {
  font-size: 1.1rem;
  margin: 0;
}

.info-icon {
  opacity: 0.9;
}

/* Social media icons */
.social-media {
  display: flex;
  gap: 1.2rem;
  margin-top: 1.5rem;
}

.social-icon-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  border: 1px solid;
  border-radius: 50%;
  transition: all 0.3s;
}

.social-icon-link:hover {
  transform: translateY(-3px);
  background-color: rgba(48, 48, 208, 0.1);
}

.social-icon {
  width: 20px;
  height: 20px;
}

/* Decorative elements */
.decoration-dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.dot {
  position: absolute;
  border-radius: 50%;
  opacity: 0.2;
  animation: float 10s infinite ease-in-out;
}

.decoration-circle {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  top: -100px;
  right: -100px;
  border: 40px solid;
  z-index: 1;
  opacity: 0.3;
}

/* Animations */
@keyframes shine {
  to {
    background-position: 200% center;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .title {
    font-size: 2.8rem;
  }

  .subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  .contact-form {
    padding: 0 10px;
  }

  .decoration-circle {
    width: 250px;
    height: 250px;
  }
}
</style>
