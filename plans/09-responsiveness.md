# Plan: Responsiveness

> Generated for Claude Code. Review Open Questions before running.

## Goal

Ensure all sections display correctly across standard Tailwind breakpoints (sm / md / lg / xl) using a mobile-first approach, with special attention to the Skills constellation canvas which is broken at widths ≤ 700px.

## Steps

1. **Audit all sections** — open the site at 375px, 640px, 768px, 1024px, 1280px and note any layout issues before making changes

2. **Fix Skills canvas at narrow widths** — in `ConstellationCanvas.tsx`, make `HIT_RADIUS`, `TEXT_OFFSET`, and `LINE_GAP` scale dynamically with canvas width instead of being fixed constants; reduce font sizes more aggressively below 640px so node labels and orbit text do not overlap

3. **Fix Skills canvas height** — in `SkillsSection.tsx`, increase canvas height on mobile (e.g. `h-[700px]`) so bottom nodes are not clipped; adjust breakpoint heights as needed

4. **Adapt Hero** — verify canvas animation, floating card, and tech ticker do not overflow on small screens; fix any overflow or clipping

5. **Adapt About** — verify stats row and timeline list reflow correctly on mobile; ensure no horizontal overflow

6. **Adapt Projects** — verify grid collapses to 1 column on mobile and flip triggers correctly on tap (touch events)

7. **Fix typography & spacing** — audit font sizes, line heights, and section padding across breakpoints; apply responsive Tailwind utilities where needed

8. **Verify no horizontal scroll** — confirm `overflow-x` is clean at every breakpoint; add `overflow-x: hidden` to root if needed

9. **Run make ci** — resolve any TypeScript, lint, or test failures

## Definition of Done

- [ ] All sections display correctly at 375px, 640px, 768px, 1024px, and 1280px
- [ ] Skills constellation canvas renders without overlapping nodes or clipped text at widths ≤ 700px
- [ ] No horizontal scroll on any screen size
- [ ] Projects grid is 1 column on mobile, 2 columns on sm+
- [ ] Projects flip triggers on tap on touch devices
- [ ] Hero canvas and layout adapt to small screens without overflow
- [ ] Typography is readable on all breakpoints
- [ ] `make ci` passes (format-check, lint, test, build, e2e)

## Conventions to Follow

- Stack: Vite + React + TypeScript + Tailwind CSS v4
- Mobile-first — base styles target mobile, breakpoints scale up
- Standard Tailwind breakpoints only: sm / md / lg / xl — no custom breakpoints
- No hardcoded color values — reference CSS custom properties only
- All text content is mock/fake data — do not change existing copy
- Never commit directly to main — feature branch only
- No commit or push without explicit user command (завершить / finish)
- Run `make lint` and `make format-check` after each significant change

## ⚠️ Open Questions

- If a canvas node cannot be made legible at very narrow widths (< 400px) within reasonable effort, should Claude Code provide a simplified tag-list fallback for mobile, or keep the canvas and accept minor visual imperfections?
