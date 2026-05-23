# Plan: Skills Section — Constellation Canvas

> Generated for Claude Code. Review Open Questions before running.

## Goal

Implement the Skills section as an interactive constellation canvas where each technology is a star node with orbit animation, comet-reveal text, and falling-letter deactivation.

## Steps

1. **Create** `SkillsSection` organism — full-width section wrapper with section heading, mount point for the canvas
2. **Create** `ConstellationCanvas` component — manages the canvas element, resize handling, and renders all nodes and connector lines between related technologies
3. **Implement** `SkillNode` class/object — encapsulates all per-node state and drawing: flickering core dot (brightness only, fixed size), dashed orbit ring, 6 rays, orbiting particles, orbit label text rotating counter-clockwise with synchronous radial pulse
4. **Implement** inactive → active state — on node click: pulse wave, orbit text fades out, comet launches after 300 ms delay
5. **Implement** comet reveal — comet travels left-to-right across text area, illuminates characters as it passes; text flashes then settles at readable brightness
6. **Implement** deactivation — on canvas click outside node: falling letters animation (each letter falls independently with gravity, zeroes its source slot on first frame), orbit text fades back in, node returns to inactive state
7. **Add** constellation connector lines — thin low-opacity lines between related nodes (React–TypeScript, React–Vite, etc.), visible in inactive state, brighten when either connected node is active
8. **Integrate** `SkillsSection` into main page layout between `AboutSection` and the next section
9. **Apply** theme tokens — accent color, background, and text colors sourced from the existing Light / Dark / Nord theme system; no hardcoded hex values

## Definition of Done

- [ ] All nodes render with orbiting particles, rays, dashed ring, and counter-clockwise pulsing orbit text
- [ ] Click on node activates it: pulse wave fires, orbit text fades out, comet reveals text
- [ ] Click on canvas (outside node) deactivates: letters fall with gravity, orbit text returns
- [ ] Connector lines visible between related technologies
- [ ] All three themes (Light / Dark / Nord) render correctly
- [ ] Canvas resizes correctly on window resize
- [ ] No hardcoded colors — all values from theme tokens

## Conventions to Follow

- No ready-made layouts generated upfront — Claude Code decides implementation details
- All text content is mock/fake data — Claude Code fills in technology names and descriptions
- Components follow existing organism/atom structure of the project
- Top-level instructions only — Claude Code handles all implementation specifics

## ⚠️ Open Questions

- How many skill nodes should be on the canvas? Confirm list of technologies or let Claude Code decide mock data.
- Should nodes have fixed positions or be algorithmically distributed across the canvas?
- On mobile (touch), does tap activate the node? Or is the section replaced with a simpler layout?
