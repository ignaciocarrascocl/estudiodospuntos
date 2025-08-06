<template>
  <div class="services-content" :style="sectionStyle">
    <div class="container">
      <div class="content px-4 py-8">
        <h1 class="text-4xl font-bold text-center mb-3" :style="{ color: sectionStyle.color }">
          Impulsamos tu Marca al Siguiente Nivel
        </h1>
        <p class="text-xl text-center mb-8" :style="{ color: sectionStyle.color }">
          En Estudio Dos Puntos, transformamos tu presencia digital con estrategias creativas y resultados medibles.
        </p>

        <!-- Services Grid -->
        <div class="services-grid">
          <!-- Service 1: Diseño de Marca -->
          <div class="service-card" :style="{ borderColor: sectionStyle.color }">
            <div class="service-icon">
              <i class="bi bi-palette-fill"></i>
            </div>
            <h3 class="service-title">
              Diseño de Marca (Branding)
            </h3>
            <p class="service-subtitle">
              Creamos la identidad visual completa de tu negocio.
            </p>
            <div class="service-content">

              <ul class="service-list">
                <li>Diseño de logotipo y sus variaciones</li>
                <li>Definición de paleta de colores y tipografías</li>
                <li>Manual de marca con guías de uso</li>
              </ul>
            </div>
          </div>

          <!-- Service 2: Creación de Páginas Web -->
          <div class="service-card" :style="{ borderColor: sectionStyle.color }">
            <div class="service-icon">
              <i class="bi bi-laptop"></i>
            </div>
            <h3 class="service-title">
              Creación de Páginas Web
            </h3>
            <p class="service-subtitle">
              Diseñamos y desarrollamos sitios web modernos, rápidos y funcionales.
            </p>
            <div class="service-content">

              <ul class="service-list">
                <li>Diseño UI/UX personalizado y centrado en el usuario</li>
                <li>Desarrollo 100% responsivo (adaptable a móviles)</li>
                <li>Optimización SEO básica para un buen posicionamiento inicial</li>
              </ul>
            </div>
          </div>

          <!-- Service 3: Gestión de Redes Sociales -->
          <div class="service-card" :style="{ borderColor: sectionStyle.color }">
            <div class="service-icon">
              <i class="bi bi-share-fill"></i>
            </div>
            <h3 class="service-title">
              Gestión de Redes Sociales
            </h3>
            <p class="service-subtitle">
              Construimos y gestionamos una comunidad activa para tu marca.
            </p>
            <div class="service-content">

              <ul class="service-list">
                <li>Estrategia de contenidos y comunicación</li>
                <li>Creación de parrilla de contenidos mensual</li>
                <li>Community Management: respondemos comentarios y mensajes</li>
              </ul>
            </div>
          </div>

          <!-- Service 4: Publicidad Digital -->
          <div class="service-card" :style="{ borderColor: sectionStyle.color }">
            <div class="service-icon">
              <i class="bi bi-graph-up-arrow"></i>
            </div>
            <h3 class="service-title">
              Publicidad Digital (Ads)
            </h3>
            <p class="service-subtitle">
              Creamos y optimizamos campañas de anuncios en Google y Meta.
            </p>
            <div class="service-content">

              <ul class="service-list">
                <li>Investigación de audiencias y palabras clave</li>
                <li>Creación de textos y creatividades para anuncios</li>
                <li>Gestión y optimización continua de las campañas</li>
              </ul>
            </div>
          </div>

          <!-- Service 5: Diseño Gráfico Corporativo -->
          <div class="service-card" :style="{ borderColor: sectionStyle.color }">
            <div class="service-icon">
              <i class="bi bi-file-earmark-text"></i>
            </div>
            <h3 class="service-title">
              Diseño Gráfico Corporativo
            </h3>
            <p class="service-subtitle">
              Creamos materiales visuales que refuerzan la imagen profesional de tu empresa.
            </p>
            <div class="service-content">

              <ul class="service-list">
                <li>Diseño de presentaciones de alto impacto</li>
                <li>Creación de papelería, folletos y otros elementos gráficos</li>
                <li>Garantía de consistencia de tu marca en todos los materiales</li>
              </ul>
            </div>
          </div>

          <!-- Service 6: Capacitación y Seguimiento -->
          <div class="service-card" :style="{ borderColor: sectionStyle.color }">
            <div class="service-icon">
              <i class="bi bi-gear-fill"></i>
            </div>
            <h3 class="service-title">
              Capacitación y Seguimiento en Herramientas Digitales
            </h3>
            <p class="service-subtitle">
              Te ayudamos a integrar y optimizar herramientas digitales para tu negocio.
            </p>
            <div class="service-content">

              <ul class="service-list">
                <li>Capacitación en el uso de herramientas de IA, CRM y otras plataformas clave</li>
                <li>Seguimiento y soporte en la implementación de estas soluciones</li>
                <li>Recomendaciones para mejorar la eficiencia y los procesos internos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'ServicesView',
  setup() {
    // Default colors
    const sectionStyle = ref({
      backgroundColor: '#3030D0',
      color: '#FF97D6'
    });

    // Handler for theme-change events (when logo is clicked)
    const handleThemeChange = (event) => {
      // Check if this event is for this section
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
      sectionStyle
    };
  }
}
</script>

<style scoped>
.services-content {
  min-height: 100vh;
  transition: background-color 0.5s, color 0.5s;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2rem 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 3rem;
  margin: 0 auto;
  padding-top: 2rem;
}

.service-card {
  background: #ffffff;
  border: none;
  padding: 3.5rem 2.5rem 2.5rem 2.5rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  position: relative;
  margin-top: 2rem;
}

.service-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.12);
}

.service-icon {
  position: absolute;
  top: -2.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 5rem;
  height: 5rem;
  background: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  transition: all 0.4s ease;
  border: 3px solid #f8f9fa;
  color: rgb(48, 48, 208);
}

.service-card:hover .service-icon {
  transform: translateX(-50%) scale(1.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
}

.service-title {
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
  color: #000000;
  line-height: 1.3;
}

.service-subtitle {
  font-size: 1.25rem;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 500;
  color: #000000;
  line-height: 1.4;
}

.service-content {
  color: #2d3748;
}

.content-section-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 1.5rem 0 0.75rem 0;
  transition: color 0.3s ease;
  color: rgb(48, 48, 208);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.content-section-title i {
  font-size: 1rem;
  color: rgb(48, 48, 208);
}

.service-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.service-list li {
  padding: 0.5rem 0;
  position: relative;
  padding-left: 2rem;
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.5;
}

.service-list li:before {
  content: "●";
  font-weight: bold;
  position: absolute;
  left: 0.5rem;
  top: 0.5rem;
  font-size: 0.8rem;
}

.service-content p {
  margin: 0.75rem 0;
  line-height: 1.6;
  color: #4a5568;
  font-size: 1rem;
}

.service-content strong {
  font-weight: 700;
  color: #1a1a1a;
}

/* Mobile adjustments */
@media screen and (max-width: 1024px) {
  .services-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    gap: 2.5rem;
  }
}

@media screen and (max-width: 768px) {
  .services-content {
    padding: 8rem 0;
  }

  .services-grid {
    gap: 3.5rem;
    padding-top: 1.5rem;
  }

  .service-card {
    padding: 3rem 2rem 2rem 2rem;
    margin-top: 2.5rem;
  }

  .service-icon {
    width: 4rem;
    height: 4rem;
    font-size: 2rem;
    top: -2rem;
  }

  .service-title {
    font-size: 1.5rem;
  }

  .service-subtitle {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .content-section-title {
    font-size: 1rem;
  }

  .service-list li {
    font-size: 0.95rem;
  }

  .service-content p {
    font-size: 0.95rem;
  }
}

@media screen and (max-width: 480px) {
  .content {
    padding: 1rem !important;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .service-card {
    padding: 2.5rem 1.5rem 1.5rem 1.5rem;
    margin-top: 1rem;
  }

  .service-icon {
    width: 3.5rem;
    height: 3.5rem;
    font-size: 1.8rem;
    top: -1.75rem;
  }

  .service-title {
    font-size: 1.3rem;
  }

  .service-subtitle {
    font-size: 1rem;
  }
}
</style>
