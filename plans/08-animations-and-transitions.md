# Plan: Animations and Transitions

> Generated for Claude Code. Review Open Questions before running.

## Goal

Unify all entry animations under Framer Motion — replace manual CSS delays in Hero with stagger, add scroll-triggered reveal with stagger to About, Skills, and Projects sections.

## Steps

1. **Install** `framer-motion` as a production dependency
2. **Create** shared animation variants file `src/lib/animation-variants.ts` — export `fadeInUp` (item variant: opacity 0→1, y 24→0), `staggerContainer` (container variant with `staggerChildren: 0.08, delayChildren: 0`), and `staggerContainerDelayed` (same but `delayChildren: 0.1` for scroll-triggered use)
3. **Refactor** `Hero` component — remove manual `DELAY(n)` helper and inline `animation` style props; wrap children in `motion.div` with `staggerContainer` variant using `initial="hidden" animate="visible"`; apply `fadeInUp` variant to each animated child
4. **Add scroll reveal to** `AboutSection` — wrap section root in `motion.section` with `whileInView`, `once: true`, `amount: 0.15`; apply `staggerContainer` to stats row and timeline list so each stat and `TimelineItem` fades in sequentially
5. **Add scroll reveal to** `SkillsSection` — wrap section root in `motion.section` with `whileInView`; apply `staggerContainer` to skill nodes or tag list as appropriate
6. **Add scroll reveal to** `ProjectsSection` — wrap section root in `motion.section` with `whileInView`; apply `staggerContainer` to the card grid so each `ProjectCard` fades in sequentially (do not touch internal ProjectCard animations)
7. **Run** `make ci` — fix any TypeScript or lint errors before finalising

## Definition of Done

- [ ] `framer-motion` is listed in `dependencies` in `package.json`
- [ ] `src/lib/animation-variants.ts` exists and exports shared variants
- [ ] Hero children animate in sequentially on page load via Framer Motion (no manual `DELAY` helper remaining)
- [ ] About, Skills, Projects sections animate in when scrolled into view
- [ ] Elements inside About and Skills appear with stagger, not all at once
- [ ] ProjectCard internal animations (flip, comet, typewriter, flying tags) are unaffected
- [ ] `make ci` passes (format-check, lint, test, build, e2e)

## Conventions to Follow

- Branch name: `feat/08-animations-and-transitions`
- All changes on a feature branch — never commit directly to `main`
- No commit or push without explicit user command (`завершить` / `finish`)
- `noUnusedLocals` and `noUnusedParameters` are enabled — remove any imports or variables that become unused after refactoring
- `verbatimModuleSyntax` is enabled — use `import type` for type-only imports
- Run `make lint` and `make format-check` after each significant change
- Mock/fake data only — do not change existing copy
