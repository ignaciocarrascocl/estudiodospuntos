import { gsap } from 'gsap'

export default function useLogoPosition(logoContainer, logoRef, isInCorner) {
  // Constants for logo sizes
  const LOGO_CORNER_SIZE = '100px'
  const LOGO_CENTER_SIZE = '100%'
  const LOGO_CORNER_SIZE_MOBILE = '80px'
  const LOGO_CENTER_SIZE_MOBILE = '100%'

  // Check if device is mobile
  const isMobile = () => window.innerWidth <= 768

  // Get appropriate sizes based on device
  const getLogoSizes = () => {
    return {
      corner: isMobile() ? LOGO_CORNER_SIZE_MOBILE : LOGO_CORNER_SIZE,
      center: isMobile() ? LOGO_CENTER_SIZE_MOBILE : LOGO_CENTER_SIZE,
    }
  }

  // Enhanced function to maintain logo size after logo image changes
  // Now with immediate and delayed application for reliability
  const maintainLogoSize = () => {
    if (!logoRef.value) return

    const sizes = getLogoSizes()
    const targetSize = isInCorner.value ? sizes.corner : sizes.center

    // Apply immediately
    logoRef.value.style.width = targetSize

    // Also apply after a brief delay to catch any DOM updates
    // This helps with rapid clicking and race conditions
    setTimeout(() => {
      if (logoRef.value) {
        logoRef.value.style.width = targetSize
      }
    }, 50)
  }

  // Initial setup to ensure logo is always using fixed positioning
  const setupLogoPositioning = () => {
    if (!logoContainer.value) return

    const sizes = getLogoSizes()

    // Always use fixed positioning
    logoContainer.value.style.position = 'fixed'

    // Initial position should be center if in first section
    if (!isInCorner.value) {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      logoContainer.value.style.left = `${windowWidth / 2}px`
      logoContainer.value.style.top = `${windowHeight / 3}px` // Position 1/3 down from top
      logoContainer.value.style.transform = 'translate(-50%, -50%)'

      // Set center size
      if (logoRef.value) {
        logoRef.value.style.width = sizes.center
      }
    } else {
      // Position in corner
      logoContainer.value.style.top = '20px'
      logoContainer.value.style.left = '20px'
      logoContainer.value.style.transform = 'none'

      // Set corner size
      if (logoRef.value) {
        logoRef.value.style.width = sizes.corner
      }
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

    // Animate position
    tl.to(
      logoContainer.value,
      {
        top: '20px',
        left: '20px',
        transform: 'none',
        duration: 0.6,
        ease: 'power2.inOut',
      },
      0,
    )

    // Animate size simultaneously
    if (logoRef.value) {
      tl.to(
        logoRef.value,
        {
          width: sizes.corner,
          duration: 0.6,
          ease: 'power2.inOut',
        },
        0,
      ) // Start at the same time
    }
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

    // Animate position
    tl.to(
      logoContainer.value,
      {
        top: `${windowHeight / 3}px`,
        left: `${windowWidth / 2}px`,
        transform: 'translate(-50%, -50%)',
        duration: 0.6,
        ease: 'power2.inOut',
      },
      0,
    )

    // Animate size simultaneously
    if (logoRef.value) {
      tl.to(
        logoRef.value,
        {
          width: sizes.center,
          duration: 0.6,
          ease: 'power2.inOut',
        },
        0,
      ) // Start at the same time
    }
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

      // Update size for responsive design
      if (logoRef.value) {
        logoRef.value.style.width = sizes.center
      }
    } else {
      // Update size for responsive design in corner
      if (logoRef.value) {
        logoRef.value.style.width = sizes.corner
      }
    }
  }

  return {
    setupLogoPositioning,
    moveLogoToCorner,
    moveLogoToCenter,
    handleResize,
    maintainLogoSize,
  }
}
