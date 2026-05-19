import type { Decorator, Preview } from '@storybook/react-vite'
import '../src/index.css'
import { THEMES, THEME_META, type Theme } from '../src/theme/themes'
import ThemedFrame from './ThemedFrame'

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as Theme) ?? 'light'
  return (
    <ThemedFrame theme={theme}>
      <Story />
    </ThemedFrame>
  )
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      description: 'Active color theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: THEMES.map((t) => ({
          value: t,
          title: `${THEME_META[t].symbol} ${THEME_META[t].label}`,
        })),
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
}

export default preview
