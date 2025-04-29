import { createClient } from 'contentful'

const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
  environment: 'master',
})

export async function getPortfolioItems() {
  try {
    const response = await client.getEntries({
      content_type: 'portfafolio', // Asegúrate que coincida con el ID del tipo en Contentful
      order: 'sys.createdAt' // Ordenar por fecha de creación o puedes usar otro campo
    })

    return response.items.map(item => ({
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
    }))
  } catch (error) {
    console.error('Error al obtener datos de Contentful:', error)
    return []
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
