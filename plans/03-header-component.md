# Plan: Header Component

> Generated for Claude Code. Review Open Questions before running.

## Goal

Build a fixed, responsive Header component with section navigation and an animated atomic ThemeToggle with three orbiting electrons representing Light, Dark, and Nord themes.

## Steps

1. **Create Header component** — fixed top bar layout
2. **Add logo / name mark** — mock developer name or monogram, left side
3. **Build desktop nav** — anchor links for Hero, About, Skills, Projects; highlight active link on scroll
4. **Build ThemeToggle (Atom)** — nucleus + 3 orbits (different radius and tilt) + 3 electrons with icons ☀️ 🌙 🏔; rotation stops on hover; click activates theme via Tailwind theme system; active electron pulses, its orbit is slightly brighter with a travelling glow along the line
5. **Build mobile menu** — hamburger button on the left; drawer opens from the right with smooth animation; background behind drawer darkens; closes on link click or tap on darkened area
6. **Apply scroll behaviour** — on scroll, header gains background dimming / shadow and becomes shorter; in default state — transparent and full height
7. **Wire into layout** — add Header component to the root layout above all sections

## Definition of Done

- [ ] Header is fixed and visible across all sections on desktop and mobile
- [ ] Clicking a nav link smoothly scrolls to the correct section
- [ ] Active nav link is highlighted on scroll
- [ ] Clicking an electron activates the theme via Tailwind theme system
- [ ] Active electron pulses, its orbit is brighter with a travelling glow
- [ ] Electron rotation stops on hover over the component
- [ ] Mobile menu: hamburger on the left, drawer on the right with smooth animation and background dimming
- [ ] Scrolled state: header becomes shorter with background and shadow
- [ ] No TypeScript errors
- [ ] No lint errors

## Conventions to Follow

- Stack: Vite + React + TypeScript + Tailwind CSS v4
- Component variants via `tailwind-variants`
- No hardcoded color values — use CSS custom properties only
- Three themes: Light, Dark, Nord
- All text content is mock/fake data — Claude Code picks names, labels, copy
- Claude Code decides implementation details independently

## ⚠️ Open Questions

- None
