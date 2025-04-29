import { ref, watch } from 'vue'
import {
  validColorThemes,
  dispatchThemeChange,
  sectionThemePairs,
} from '../constants/themeConstants'

export default function useThemeManagement(isLogoA) {
  // Section themes storage - using indices into validColorThemes array
  const sectionThemes = ref({
    1: 0, // Will be set based on current logo
    2: 0, // Will be set based on current logo
    3: 0, // Will be set based on current logo
    4: 0, // Will be set based on current logo
  })

  // Initialize section themes based on current logo
  const initializeSectionThemes = () => {
    console.log('Initializing section themes for logo version:', isLogoA.value ? 'A' : 'B')

    // Set each section to the appropriate theme based on current logo
    for (let i = 1; i <= 4; i++) {
      const themeIndex = isLogoA.value ? sectionThemePairs[i].logoA : sectionThemePairs[i].logoB

      sectionThemes.value[i] = themeIndex

      // Dispatch theme change event
      dispatchThemeChange(i, validColorThemes[themeIndex])
    }

    console.log('Initialized fixed themes:', sectionThemes.value)
  }

  // Update all section themes to match current logo
  const updateThemesForLogo = () => {
    console.log('Updating themes for logo version:', isLogoA.value ? 'A' : 'B')

    // Update each section to the appropriate theme based on current logo
    for (let i = 1; i <= 4; i++) {
      const themeIndex = isLogoA.value ? sectionThemePairs[i].logoA : sectionThemePairs[i].logoB

      // Only update and dispatch event if the theme is changing
      if (sectionThemes.value[i] !== themeIndex) {
        sectionThemes.value[i] = themeIndex
        dispatchThemeChange(i, validColorThemes[themeIndex])
        console.log(`Section ${i} theme updated to:`, validColorThemes[themeIndex].background)
      }
    }
  }

  // Toggle theme color for the current section based on current logo
  const changeThemeColor = (currentSection) => {
    console.log('Toggling theme for section:', currentSection)

    // Toggle logo first
    isLogoA.value = !isLogoA.value

    // Then update theme based on the new logo value
    const themeIndex = isLogoA.value
      ? sectionThemePairs[currentSection].logoA
      : sectionThemePairs[currentSection].logoB

    sectionThemes.value[currentSection] = themeIndex

    // Dispatch event
    dispatchThemeChange(currentSection, validColorThemes[themeIndex])
    console.log('Changed theme to:', validColorThemes[themeIndex].background)
  }

  // Watch for logo changes to ensure theme compatibility
  watch(
    () => isLogoA.value,
    (newValue) => {
      console.log('Logo changed to version:', newValue ? 'A' : 'B')
      updateThemesForLogo()
    },
  )

  return {
    sectionThemes,
    initializeSectionThemes,
    updateThemesForLogo,
    changeThemeColor,
  }
}
