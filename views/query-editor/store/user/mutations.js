import rgbHex from 'rgb-hex'
import { hsp } from '~/utilities/hsp'
import darkTheme from '~/assets/json/dark-theme.json'
import lightTheme from '~/assets/json/light-theme.json'
import editorColors from '~/assets/json/editor-colors.json'

export default {
  setConfiguration(state, configuration) {
    state.configuration = configuration
  },
  setActiveMenu(state, activeMenu) {
    state.activeMenu = activeMenu
  },
  reset: (state) => {
    state.theme = darkTheme
    state.configuration = {
      displayEditor: true,
      format: {
        automatically: true,
      },
      fieldType: {
        table: false,
        form: false,
      },
      nestedResults: {
        style: false,
        expanded: false,
        depth: false,
      },
      groupSelectedFields: true,
    }
  },
  setThemeColors: (state, colors) => {
    state.theme.colors = {}
    const isLight = hsp(colors['--vscode-editor-background']) === 'light'
    state.theme.rules = isLight ? [...lightTheme.rules] : [...darkTheme.rules]

    Object.entries(colors).forEach(([colorKey, colorValue]) => {
      document.documentElement.style.setProperty(colorKey, colorValue)

      const monacoColorKey = colorKey
        .replace(/--vscode-/g, '')
        .replaceAll(/-/g, '.')
      if (editorColors.includes(monacoColorKey)) {
        let hex = colorValue
        if (colorValue.includes('rgb') || colorValue.includes('rgba'))
          hex = '#' + rgbHex(colorValue)
        state.theme.colors[monacoColorKey] = hex
      }
    })

    state.theme = { ...state.theme }
  },
  setIsLocalServerRunning: (state, isLocalServerRunning) => {
    state.isLocalServerRunning = isLocalServerRunning
  },
}
