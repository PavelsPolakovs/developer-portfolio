# Plan: Theme System Setup

> Generated for Claude Code. Review Open Questions before running.

## Goal

Implement a three-theme system (Light, Dark, Nord) with CSS custom properties, a ThemeProvider context, and an animated orbital ThemeSwitcher component.

## Steps

1. **Define theme tokens** — add `.theme-light`, `.theme-dark`, `.theme-nord` CSS classes with custom property variables to `index.css`
2. **Configure Tailwind** — register theme tokens as semantic utility values in `tailwind.config.ts`
3. **Create ThemeProvider** — context + `useTheme` hook, toggle theme by swapping class on `<html>`, persist choice to `localStorage`
4. **Wrap the app** — import and apply `ThemeProvider` in `main.tsx`
5. **Create ThemeSwitcher component** — SVG orbital ring with three electron buttons (☀️ 🌙 🏔), continuous CSS rotation animation, pulse/glow effect on the active electron, click sets theme via `useTheme`
6. **Audit project tooling** — inspect existing config files and tooling setup, then add or update whatever is needed to support the new theme system (stories, tests, decorators, etc.)

## Definition of Done

- [ ] All three themes apply correctly when selected
- [ ] Theme persists across page refresh
- [ ] ThemeSwitcher orbital animation runs continuously without interruption
- [ ] Active electron has visible pulse/glow effect
- [ ] Clicking any electron switches the theme immediately
- [ ] Project tooling is updated to reflect the new theme system

## Conventions to Follow

- Stack: Vite + React + TypeScript + Tailwind CSS
- Component variants via `tailwind-variants`
- No hardcoded color values — reference CSS custom properties only
- All content is mock/fake data
- Claude Code decides implementation details independently
- Theme palettes must be harmonious across all three themes — pick colors that feel intentional together
- **Light** — warm, creamy base tones; cozy and soft feel
- **Dark** — soft dark background with deep green accents; calm and focused feel
- **Nord** — follow the original Nord palette by arcticicstudio exactly
