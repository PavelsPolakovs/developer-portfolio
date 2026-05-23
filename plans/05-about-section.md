# Plan: About Section

> Generated for Claude Code. Review Open Questions before running.

## Goal

Create the About section with a full-width header block, stats, and an interactive vertical timeline with atom animations and a typewriter modal.

## Steps

1. **Create** `AboutSection` organism — full-width layout with section tag, heading, bio text
2. **Add** stats row — three stats inline (`4+` / `20+` / `8`), coffee stat `∞` on a separate line below
3. **Create** `TimelineAtom` atom — nucleus, orbit, electron; inactive state spins slowly, active state triggers pulse wave animation (nucleus dims to a dark dot but stays visible → wave expands far past orbit → orbit and electron flash)
4. **Create** `TimelineItem` molecule — wraps `TimelineAtom` + year + title + description; handles active/inactive state
5. **Assemble** vertical timeline — five items from 2026 to 2021, shifted right, connected by a vertical line
6. **Add** modal — centered overlay, opens on timeline item click, closes on backdrop or button click
7. **Implement** typewriter effect — text renders character by character on modal open
8. **Wire** active state — clicking an item sets it active, deactivates others, opens modal with corresponding text
9. **Add** `AboutSection` to main page between `HeroSection` and next section
10. **Document** `TimelineAtom`, `TimelineItem`, `AboutSection` in Storybook

## Definition of Done

- [ ] All five timeline items render with atom animations
- [ ] Inactive atom: nucleus filled, electron spins slowly
- [ ] Active atom: nucleus pulses then dims to a dark dot (stays visible), wave expands far past orbit, orbit and electron flash on wave contact
- [ ] Clicking an item activates it, deactivates others, opens modal
- [ ] Typewriter effect plays on modal open
- [ ] Closing modal (backdrop or button) resets atom to inactive state
- [ ] Section renders correctly in all three themes (Light / Dark / Nord)
- [ ] Components documented in Storybook

## Conventions to Follow

- Vite + React + TypeScript
- Tailwind CSS for styling
- Storybook for component documentation
- Organism / Molecule / Atom component structure
- Fake/mock data only — no real personal content
- CSS animations via keyframes (not Framer Motion unless already in project)
