import { gsap } from 'gsap'

export default function useLogoPosition(logoContainer, logoRef, isInCorner) {
  // Constants for logo container sizes
  const LOGO_CORNER_SIZE = '100px'
  const LOGO_CENTER_SIZE = '400px' // Ajustado para mantener proporción visual
  const LOGO_CORNER_SIZE_MOBILE = '100px'
  const LOGO_CENTER_SIZE_MOBILE = '400px' // Ajustado para mantener proporción visual

  // Check if device is mobile
  const isMobile = () => window.innerWidth <= 768

  // Get appropriate sizes based on device
  const getLogoSizes = () => {
    return {
      corner: isMobile() ? LOGO_CORNER_SIZE_MOBILE : LOGO_CORNER_SIZE,
      center: isMobile() ? LOGO_CENTER_SIZE_MOBILE : LOGO_CENTER_SIZE,
    }
  }

  // Initial setup to ensure logo is always using fixed positioning
  const setupLogoPositioning = () => {
    if (!logoContainer.value) return

    const sizes = getLogoSizes()

    // Always use fixed positioning
    logoContainer.value.style.position = 'fixed'

    // Set logo image to always fill container
    if (logoRef.value) {
      logoRef.value.style.width = '100%'
      logoRef.value.style.height = 'auto'
    }

    // Initial position should be center if in first section
    if (!isInCorner.value) {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      logoContainer.value.style.left = `${windowWidth / 2}px`
      logoContainer.value.style.top = `${windowHeight / 3}px` // Position 1/3 down from top
      logoContainer.value.style.transform = 'translate(-50%, -50%)'

      // Set center size for container
      logoContainer.value.style.width = sizes.center
      logoContainer.value.style.height = 'auto'
    } else {
      // Position in corner
      logoContainer.value.style.top = '20px'
      logoContainer.value.style.left = '20px'
      logoContainer.value.style.transform = 'none'

      // Set corner size for container
      logoContainer.value.style.width = sizes.corner
      logoContainer.value.style.height = 'auto'
    }
  }

  // Move logo to corner with animation
  const moveLogoToCorner = () => {
    if (isInCorner.value || !logoContainer.value) return

    const sizes = getLogoSizes()

    // Ensure element is in the body
    if (logoContainer.value.parentElement !== document.body) {
      document.body.appendChild(logoContainer.value)
    }

    // Create a timeline for coordinated animations
    const tl = gsap.timeline({
      onComplete: () => {
        isInCorner.value = true
      },
    })

    // Animate position and size of container
    tl.to(
      logoContainer.value,
      {
        top: '20px',
        left: '20px',
        transform: 'none',
        width: sizes.corner,
        duration: 0.6,
        ease: 'power2.inOut',
      },
      0,
    )
  }

  // Move logo to center with animation
  const moveLogoToCenter = () => {
    if (!isInCorner.value || !logoContainer.value) return

    const sizes = getLogoSizes()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // Create a timeline for coordinated animations
    const tl = gsap.timeline({
      onComplete: () => {
        isInCorner.value = false
      },
    })

    // Animate position and size of container
    tl.to(
      logoContainer.value,
      {
        top: `${windowHeight / 3}px`,
        left: `${windowWidth / 2}px`,
        transform: 'translate(-50%, -50%)',
        width: sizes.center,
        duration: 0.6,
        ease: 'power2.inOut',
      },
      0,
    )
  }

  // Handle window resize
  const handleResize = () => {
    if (!logoContainer.value) return

    const sizes = getLogoSizes()

    if (!isInCorner.value) {
      // Update center position if logo is centered
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      logoContainer.value.style.left = `${windowWidth / 2}px`
      logoContainer.value.style.top = `${windowHeight / 3}px`
      logoContainer.value.style.width = sizes.center
    } else {
      // Update size for responsive design in corner
      logoContainer.value.style.width = sizes.corner
    }
  }

  return {
    setupLogoPositioning,
    moveLogoToCorner,
    moveLogoToCenter,
    handleResize,
  }
}
