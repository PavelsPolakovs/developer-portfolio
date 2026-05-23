# Plan: Projects Section

> Generated for Claude Code. Review Open Questions before running.

## Goal

Implement the Projects section with a 2-column card grid, flip animation, comet on badge perimeter, typewriter + flying tags on back face — mounted after the Skills section.

## Steps

1. **Create** `ProjectCard` component — accepts `title`, `description`, `tech[]`, `repoUrl`, `screenshot` props
2. **Implement front face** — full-width `<img>` screenshot filling the card, mobile mockup overlapping bottom-right (clipped by card overflow hidden), badge with project name inside card (semi-transparent dark bg, outlined text, `paint-order: stroke fill`)
3. **Implement comet animation** on badge perimeter — canvas-based, drawn on a canvas element absolutely positioned over badge, flies continuously along rounded-rect path matching badge border-radius, starts after component mounts
4. **Implement back face** — description text, tech tags, GitHub link; apply `overflow: hidden` to back face so tags are clipped before flying in
5. **Add flip logic** — `rotateY(180deg)` on hover (desktop), on click/tap (mobile); detect mobile via pointer media query or touch event
6. **Add back face animations** — typewriter effect for description with blinking cursor (~400ms delay after flip starts), tags fly in from different sides from beyond card edges one by one, link fades in last after all tags appear
7. **Create** `Projects` section component — 2-column CSS grid, maps over projects data array, section mounted after Skills in main page layout
8. **Add** mock data for 3 projects — title, description, tech stack array, repoUrl, screenshot image path (placeholder)

## Definition of Done

- [ ] Card flips on hover (desktop) and tap (mobile)
- [ ] Comet animates on badge continuously without interruption during flip
- [ ] Typewriter starts ~400ms after flip, tags fly in from card edges, link appears last
- [ ] Grid is 2 columns on desktop, 1 column on mobile
- [ ] Screenshots render via `<img>` with placeholder src
- [ ] Section is mounted after Skills in the main page layout

## Conventions to Follow

- All data and text — mock/fake content only
- Claude Code receives high-level instructions — implementation details are self-determined
- No files created without explicit request

## ⚠️ Open Questions

- Confirm the exact file/component where Skills section ends so Projects can be mounted directly after it
- Confirm image placeholder path convention used in the project (e.g. `/public/images/` or `/assets/`)
