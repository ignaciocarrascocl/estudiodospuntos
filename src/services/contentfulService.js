import { createClient } from 'contentful'

// Verificación de credenciales presentes
const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;

// Cliente con manejo de errores
let client;

try {
  // Solo crear cliente si tenemos las credenciales
  if (!spaceId || !accessToken) {
    console.error('Contentful credentials missing. Check environment variables.');
    throw new Error('Contentful configuration incomplete');
  }

  client = createClient({
    space: spaceId,
    accessToken: accessToken,
    environment: 'master',
  });
} catch (error) {
  console.error('Failed to initialize Contentful client:', error);
}

export async function getPortfolioItems() {
  try {
    // Verificar si el cliente se inicializó correctamente
    if (!client) {
      return [
        {
          id: 'error-1',
          title: 'Error de configuración',
          description: 'No se pudo conectar con Contentful. Contacta al administrador del sitio.',
          featuredImage: '/images/placeholder.jpg',
          otherImages: [],
          url: null
        }
      ];
    }

    const response = await client.getEntries({
      content_type: 'portfafolio',
      order: 'sys.createdAt'
    });

    return response.items.map(item => ({
      id: item.sys.id,
      title: item.fields.titulo,
      description: item.fields.descripcin || '',
      featuredImage: item.fields.image_destacada?.fields?.file?.url
        ? `https:${item.fields.image_destacada.fields.file.url}`
        : '/images/placeholder.jpg',
      otherImages: item.fields.otherImages
        ? item.fields.otherImages.map(img => `https:${img.fields.file.url}`)
        : [],
      url: item.fields.url || null
    }));
  } catch (error) {
    console.error('Error al obtener datos de Contentful:', error);
    return [
      {
        id: 'error-1',
        title: 'Error de conexión',
        description: 'No se pudieron cargar los proyectos. Por favor intenta más tarde.',
        featuredImage: '/images/placeholder.jpg',
        otherImages: [],
        url: null
      }
    ];
  }
}

export async function getPortfolioItem(id) {
  try {
    const item = await client.getEntry(id)

    return {
      id: item.sys.id,
      title: item.fields.titulo,
      description: item.fields.descripcin || '',
      featuredImage: item.fields.image_destacada?.fields?.file?.url
        ? `https:${item.fields.image_destacada.fields.file.url}`
        : null,
      otherImages: item.fields.otherImages
        ? item.fields.otherImages.map(img => `https:${img.fields.file.url}`)
        : [],
      url: item.fields.url || null
    }
  } catch (error) {
    console.error(`Error al obtener el item ${id} de Contentful:`, error)
    return null
  }
}
