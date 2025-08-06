import { ref } from 'vue'
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

    // Set each section to the appropriate theme based on current logo
    for (let i = 1; i <= 4; i++) {
      const themeIndex = isLogoA.value ? sectionThemePairs[i].logoA : sectionThemePairs[i].logoB

      sectionThemes.value[i] = themeIndex

      // Dispatch theme change event
      dispatchThemeChange(i, validColorThemes[themeIndex])
    }

  }

  // Update all section themes to match current logo
  const updateThemesForLogo = () => {


    // Update each section to the appropriate theme based on current logo
    for (let i = 1; i <= 4; i++) {
      const themeIndex = isLogoA.value ? sectionThemePairs[i].logoA : sectionThemePairs[i].logoB

      // Only update and dispatch event if the theme is changing
      if (sectionThemes.value[i] !== themeIndex) {
        sectionThemes.value[i] = themeIndex
        dispatchThemeChange(i, validColorThemes[themeIndex])

      }
    }
  }

  // Toggle theme color for the current section based on current logo
  const changeThemeColor = (currentSection) => {


    // Toggle logo first
    isLogoA.value = !isLogoA.value

    // Then update theme based on the new logo value
    const themeIndex = isLogoA.value
      ? sectionThemePairs[currentSection].logoA
      : sectionThemePairs[currentSection].logoB

    sectionThemes.value[currentSection] = themeIndex

    // Dispatch event
    dispatchThemeChange(currentSection, validColorThemes[themeIndex])

  }


  return {
    sectionThemes,
    initializeSectionThemes,
    updateThemesForLogo,
    changeThemeColor,
  }
}
