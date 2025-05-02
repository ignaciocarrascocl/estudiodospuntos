<template>
  <section id="contact" class="section is-fullheight" data-section="4" :style="sectionStyle">
    <div class="container">
      <div class="content has-text-centered px-4 py-5">
        <h1 class="title is-1 has-text-centered mb-3" :style="{ color: sectionStyle.color }">Contacto</h1>
        <p class="subtitle is-4 has-text-centered mb-5" :style="{ color: sectionStyle.color }">
          ¡Demos vida a tus ideas!
        </p>

        <form class="contact-form" action="https://formsubmit.co/icarrasco@caput.cl" method="POST"
          @submit="handleSubmit">
          <div class="field">
            <div class="columns is-mobile">
              <div class="column is-half">
                <div class="control">
                  <input type="text" name="name" id="name" required v-model="formData.name" class="input"
                    :style="inputStyle" placeholder="Nombre">
                </div>
              </div>
              <div class="column is-half">
                <div class="control">
                  <input type="email" name="email" id="email" required v-model="formData.email" class="input"
                    :style="inputStyle" placeholder="Email">
                </div>
              </div>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <textarea name="message" id="message" required v-model="formData.message" class="textarea"
                :style="inputStyle" placeholder="Mensaje" rows="4"></textarea>
            </div>
          </div>

          <!-- Campos ocultos para FormSubmit -->
          <input type="hidden" name="_subject" value="¡Nuevo contacto desde Estudio Dos Puntos!">
          <input type="hidden" name="_template" value="table">
          <input type="hidden" name="_captcha" value="false">
          <input type="hidden" name="_next" value="https://estudiodospuntos.cl/">

          <div class="field">
            <div class="control is-flex is-justify-content-flex-end">
              <button type="submit" class="button" :style="buttonStyle" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="is-flex is-align-items-center">
                  <i class="bi bi-arrow-clockwise rotating mr-2"></i>
                  Enviando...
                </span>
                <span v-else class="is-flex is-align-items-center">
                  <i class="bi bi-send-fill mr-2"></i>
                  Enviar
                </span>
              </button>
            </div>
          </div>

          <div v-if="formStatus" class="notification"
            :class="{ 'is-success': formStatus.type === 'success', 'is-danger': formStatus.type === 'error' }">
            {{ formStatus.message }}
          </div>
        </form>

        <!-- Replace your existing contact info section with this enhanced version -->
        <div class="contact-info mt-5 mb-5">
          <h4 class="subtitle is-5 has-text-centered mb-4" :style="{ color: sectionStyle.color }">Información de
            contacto</h4>
          <div class="columns is-multiline">
            <!-- Phone contact with multiple options -->
            <div class="column is-12">
              <div class="contact-options">
                <!-- Direct call option -->
                <a href="tel:+56992659949" class="contact-box" :style="contactBoxStyle">
                  <div class="is-flex is-align-items-center">
                    <span class="icon mr-2" :style="iconStyle">
                      <i class="bi bi-telephone"></i>
                    </span>
                    <p class="mb-0">+56 9 9265 9949</p>
                  </div>
                </a>

                <!-- WhatsApp option -->
                <a href="https://wa.me/56992659949" target="_blank" class="contact-box" :style="contactBoxStyle">
                  <div class="is-flex is-align-items-center">
                    <span class="icon mr-2" :style="iconStyle">
                      <i class="bi bi-whatsapp"></i>
                    </span>
                    <p class="mb-0">WhatsApp</p>
                  </div>
                </a>
                <a href="https://www.linkedin.com/in/ignaciocarrascoh/" target="_blank" class="contact-box"
                  :style="contactBoxStyle">
                  <div class="is-flex is-align-items-center">
                    <span class="icon mr-2" :style="iconStyle">
                      <i class="bi bi-linkedin"></i>
                    </span>
                    <p class="mb-0">Ignacio Carrasco - Director de Proyectos</p>
                  </div>
                </a>
                <a href="https://www.linkedin.com/in/alejandra-ram%C3%ADrez-moya-26b87b127/" target="_blank"
                  class="contact-box" :style="contactBoxStyle">
                  <div class="is-flex is-align-items-center">
                    <span class="icon mr-2" :style="iconStyle">
                      <i class="bi bi-linkedin"></i>
                    </span>
                    <p class="mb-0">Alejandra Ramírez - Directora Creativa</p>
                  </div>
                </a>
              </div>
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

    // Simplified computed styles
    const inputStyle = computed(() => ({
      backgroundColor: `${sectionStyle.value.color}10`,
      borderColor: `${sectionStyle.value.color}30`,
      color: sectionStyle.value.color
    }));

    // Add new computed property for contact box styling
    const contactBoxStyle = computed(() => ({
      borderColor: `${sectionStyle.value.color}30`,
      backgroundColor: `${sectionStyle.value.color}10`,
    }));

    // Update button style for circular shape
    const buttonStyle = computed(() => ({
      backgroundColor: sectionStyle.value.color,
      color: sectionStyle.value.backgroundColor,
      borderColor: 'transparent',
      boxShadow: `0 6px 12px ${sectionStyle.value.color}30`
    }));

    const iconStyle = computed(() => ({
      color: sectionStyle.value.color
    }));

    const iconLinkStyle = computed(() => ({
      color: sectionStyle.value.color
    }));

    // Form submission handler
    const handleSubmit = async () => {
      // FormSubmit will handle the actual submission
      isSubmitting.value = true;
      formStatus.value = null;

      // We'll let the native form submission handle the actual sending
      // but we'll add a small delay for UX purposes
      setTimeout(() => {
        formStatus.value = {
          type: 'success',
          message: 'Mensaje enviado correctamente. ¡Gracias por contactarnos!'
        };
        isSubmitting.value = false;

        // In a real implementation, FormSubmit would redirect to the _next URL
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
      inputStyle,
      buttonStyle,
      iconStyle,
      iconLinkStyle,
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
