<template>
  <section id="contact" class="w-full h-screen flex items-center justify-center" :style="sectionStyle">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto text-center px-4 py-5">
        <h1 class="text-4xl font-bold mb-3" :style="{ color: sectionStyle.color }">Contacto</h1>
        <p class="text-xl mb-5" :style="{ color: sectionStyle.color }">
          ¡Demos vida a tus ideas!
        </p>

        <form class="max-w-lg mx-auto mb-8" action="https://formsubmit.co/icarrasco@caput.cl" method="POST"
          @submit="handleSubmit">
          <div class="mb-4">
            <div class="flex flex-col md:flex-row gap-4 mb-4">
              <div class="w-full md:w-1/2">
                <input type="text" name="name" id="name" required v-model="formData.name"
                  class="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                  :style="inputStyle" placeholder="Nombre">
              </div>
              <div class="w-full md:w-1/2">
                <input type="email" name="email" id="email" required v-model="formData.email"
                  class="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
                  :style="inputStyle" placeholder="Email">
              </div>
            </div>
          </div>

          <div class="mb-4">
            <textarea name="message" id="message" required v-model="formData.message"
              class="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300"
              :style="inputStyle" placeholder="Mensaje" rows="4"></textarea>
          </div>

          <!-- Hidden fields for FormSubmit -->
          <input type="hidden" name="_subject" value="¡Nuevo contacto desde Estudio Dos Puntos!">
          <input type="hidden" name="_template" value="table">
          <input type="hidden" name="_captcha" value="false">
          <input type="hidden" name="_next" value="https://estudiodospuntos.cl/">

          <div class="flex justify-end">
            <button type="submit"
              class="px-5 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
              :style="buttonStyle" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="flex items-center">
                <i class="bi bi-arrow-clockwise animate-spin mr-2"></i>
                Enviando...
              </span>
              <span v-else class="flex items-center">
                <i class="bi bi-send-fill mr-2"></i>
                Enviar
              </span>
            </button>
          </div>

          <div v-if="formStatus" class="mt-4 p-3 rounded-lg" :class="{
            'bg-green-100 text-green-800': formStatus.type === 'success',
            'bg-red-100 text-red-800': formStatus.type === 'error'
          }">
            {{ formStatus.message }}
          </div>
        </form>

        <!-- Contact information section -->
        <div class="my-10">
          <div class="flex flex-col gap-4">
            <!-- Contact options grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Phone contact -->
              <a href="tel:+56992659949"
                class="flex items-center p-2 rounded-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                :style="contactBoxStyle">
                <span class="mr-3 text-2xl" :style="iconStyle">
                  <i class="bi bi-telephone"></i>
                </span>
                <p class="m-0 text-sm">+56 9 9265 9949</p>
              </a>

              <!-- WhatsApp contact -->
              <a href="https://wa.me/56992659949" target="_blank"
                class="flex items-center p-2 rounded-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                :style="contactBoxStyle">
                <span class="mr-3 text-2xl" :style="iconStyle">
                  <i class="bi bi-whatsapp"></i>
                </span>
                <p class="m-0 text-sm">WhatsApp</p>
              </a>

              <!-- LinkedIn - Ignacio -->
              <a href="https://www.linkedin.com/in/ignaciocarrascoh/" target="_blank"
                class="flex items-center p-2 rounded-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                :style="contactBoxStyle">
                <span class="mr-3 text-2xl" :style="iconStyle">
                  <i class="bi bi-linkedin"></i>
                </span>
                <p class="m-0 text-xs">Ignacio Carrasco - Director de Proyectos</p>
              </a>

              <!-- LinkedIn - Alejandra -->
              <a href="https://www.linkedin.com/in/alejandra-ram%C3%ADrez-moya-26b87b127/" target="_blank"
                class="flex items-center p-2 rounded-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                :style="contactBoxStyle">
                <span class="mr-3 text-2xl" :style="iconStyle">
                  <i class="bi bi-linkedin"></i>
                </span>
                <p class="m-0 text-xs">Alejandra Ramírez - Directora Creativa</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
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

    // Style computations
    const inputStyle = computed(() => ({
      backgroundColor: `${sectionStyle.value.color}10`,
      borderColor: `${sectionStyle.value.color}30`,
      color: sectionStyle.value.color
    }));

    const contactBoxStyle = computed(() => ({
      borderColor: `${sectionStyle.value.color}30`,
      backgroundColor: `${sectionStyle.value.color}10`,
    }));

    const buttonStyle = computed(() => ({
      backgroundColor: sectionStyle.value.color,
      color: sectionStyle.value.backgroundColor,
      borderColor: 'transparent',
      boxShadow: `0 6px 12px ${sectionStyle.value.color}30`
    }));

    const iconStyle = computed(() => ({
      color: sectionStyle.value.color
    }));

    // Form submission handler
    const handleSubmit = async () => {
      // Prevent default form submission if you want to handle it with AJAX
      // e.preventDefault();

      // FormSubmit will handle the actual submission
      isSubmitting.value = true;
      formStatus.value = null;

      // Simulate form submission for demo purposes
      setTimeout(() => {
        formStatus.value = {
          type: 'success',
          message: 'Mensaje enviado correctamente. ¡Gracias por contactarnos!'
        };
        isSubmitting.value = false;

        // Reset form after success message
        setTimeout(() => {
          formData.value = { name: '', email: '', message: '' };
          formStatus.value = null;
        }, 3000);
      }, 1500);
    };

    // Handler for section-change events (when navigating between sections)
    // REMOVED color-changing behavior from this handler
    const handleSectionChange = (event) => {
      // Now we only use this handler for other section-specific logic
      // that doesn't involve changing colors
      if (event.detail.section === 4) {
        // Any section-specific logic that doesn't involve colors
        // For example, you might want to reset the form when returning to this section
      }
    };

    // Handler for theme-change events (when logo is clicked)
    // This is now the ONLY place where colors should change
    const handleThemeChange = (event) => {
      // Check if this event is for this section
      if (event.detail.section === 4) {
        sectionStyle.value = {
          backgroundColor: event.detail.background,
          color: event.detail.text
        };
      }
    };

    onMounted(() => {
      // Listen for both section-change and theme-change events
      window.addEventListener('section-change', handleSectionChange);
      window.addEventListener('theme-change', handleThemeChange);
    });

    onUnmounted(() => {
      // Clean up both event listeners
      window.removeEventListener('section-change', handleSectionChange);
      window.removeEventListener('theme-change', handleThemeChange);
    });

    return {
      formData,
      isSubmitting,
      formStatus,
      sectionStyle,
      inputStyle,
      buttonStyle,
      iconStyle,
      contactBoxStyle,
      handleSubmit
    };
  }
}
</script>

<style scoped>
section {
  width: 100%;
  height: 100vh;
  transition: background-color 0.5s, color 0.5s;
}

.content {
  max-width: 800px;
  margin: 0 auto;
}

.title,
.subtitle {
  color: inherit !important;
  transition: color 0.5s;
}

/* Form styling */
.contact-form,
.contact-info {
  max-width: 500px;
  margin: 0 auto 2rem;
}

.input,
.textarea,
.button {
  transition: all 0.3s ease;
}

/* Contact box styling */
.contact-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid;
  transition: all 0.3s ease;
  height: 100%;
}

.contact-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.contact-box .icon {
  font-size: 1.8rem;
}

.contact-box p {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.contact-box a {
  color: inherit;
  text-decoration: underline;
  transition: opacity 0.3s;
}

.contact-box a:hover {
  opacity: 0.8;
}

/* Loading animation */
.rotating {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Media queries */
@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }

  .contact-box {
    padding: 1rem;
  }
}
</style>
