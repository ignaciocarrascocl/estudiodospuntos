// Define valid color themes with rules about which logo to use
export const validColorThemes = [
  { background: '#3030D0', text: '#FF97D6', requiresLogoA: true }, // Blue background + Pink text - requires logo A
  { background: '#00DEB5', text: '#3030D0', requiresLogoA: null }, // Green background + Blue text - either logo
  { background: '#FF97D6', text: '#3030D0', requiresLogoB: true }, // Pink background + Blue text - requires logo B
  { background: '#FF4B00', text: '#FFFFFF', requiresLogoA: null }, // Orange background + Pink text - either logo
  { background: '#000000', text: '#FF97D6', requiresLogoA: null }, // Black background + Pink text - either logo
  { background: '#FFFFFF', text: '#3030D0', requiresLogoA: null }, // White background + Blue text - either logo
]

// Define fixed theme pairs for each section - index into validColorThemes
export const sectionThemePairs = {
  // Section 1 (Home): Blue+Pink with Logo A / Pink+Blue with Logo B
  1: { logoA: 0, logoB: 2 },

  // Section 2 (Portfolio): Orange+Pink with Logo A / Green+Blue with Logo B
  2: { logoA: 3, logoB: 1 },

  // Section 3 (Services): Blue+Pink with Logo A / Black+Pink with Logo B
  3: { logoA: 0, logoB: 4 },

  // Section 4 (Contact): White+Blue with Logo A / Green+Blue with Logo B
  4: { logoA: 5, logoB: 1 },
}

// Dispatch a theme change event
export const dispatchThemeChange = (sectionNumber, theme) => {
  window.dispatchEvent(
    new CustomEvent('theme-change', {
      detail: {
        section: sectionNumber,
        background: theme.background,
        text: theme.text,
      },
    }),
  )
}
