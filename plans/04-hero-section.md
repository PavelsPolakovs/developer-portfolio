# Plan: Hero Section

> Generated for Claude Code. Review Open Questions before running.

## Goal

Build the Hero section — a split-layout component placed immediately after the Header, featuring an avatar, an animated canvas container with a finalized animation, a floating card, and a tech ticker.

## Steps

1. **Create Hero component** — split layout: left column with content, right column with animated container
2. **Add background** — CSS grid pattern + glow blobs
3. **Build left column** — avatar (initials-based fallback, with a comment marking where a real photo can be dropped in), name, role, short bio, three CTA buttons: View Projects · Contact Me · GitHub
4. **Build right column: animation** — 4:3 container (max height 300px, rounded corners) with a canvas animation: 3 sine waves moving left→right at different speeds (slow/fast/medium) on separate vertical offsets, plus a particle network; when a wave intersects a particle dot, the dot flashes and emits small burst particles that fade from bright to transparent
5. **Build right column: overlay** — default state shows clean animation; desktop: hover reveals semi-transparent overlay with Copy Animation button that copies the canvas animation code to clipboard; mobile: tap reveals overlay that auto-hides after 5 seconds
6. **Build floating card** — "Open to work" card with Soft wave animation (gentle ↑↓ float) and shimmer glare effect (light streak passes left→right every ~4 seconds)
7. **Build tech ticker** — continuously scrolling strip at the bottom of the section: React · TypeScript · Tailwind · Tailwind Variants · Vite · Storybook · Claude Code
8. **Add entrance animations** — staggered fade-in on all Hero elements at page load
9. **Wire into layout** — render `Hero` as the first component immediately after `Header` in the root layout

## Definition of Done

- [ ] Hero renders correctly in all three themes (Light / Dark / Nord)
- [ ] Split layout is fully responsive across desktop, tablet, and mobile
- [ ] Canvas animation runs at 60fps without jank — 3 waves at different speeds and offsets, particle network on top, burst effect on wave–dot intersection
- [ ] Burst particles fade smoothly from bright to transparent
- [ ] Desktop hover shows overlay + Copy Animation button; button copies animation code to clipboard
- [ ] Mobile tap shows overlay; overlay auto-hides after 5 seconds
- [ ] Floating card floats gently up and down with a shimmer glare passing every ~4 seconds
- [ ] Tech ticker scrolls continuously without gaps or jumps
- [ ] Entrance animations fire on page load with staggered delays per element
- [ ] `Hero` is rendered immediately after `Header` in the root layout
- [ ] TypeScript and lint pass without errors

## Conventions to Follow

- Stack: Vite + React + TypeScript + Tailwind CSS v4
- Component variants via `tailwind-variants`
- No hardcoded color values — use CSS custom properties only
- All text content is mock/fake data — Claude Code decides names, bio, and copy
- Claude Code decides folder structure and file placement independently
- Storybook stories are out of scope for this task
- No `console.log` in production code

## ⚠️ Open Questions

- The canvas animation code to copy (for the Copy Animation button) should be the self-contained JS snippet that reproduces the animation in a browser console — Claude Code decides the best way to bundle and store this string.
