# Plan: Project Initialization

> Generated for Claude Code. Review Open Questions before running.

## Goal

Bootstrap a new Vite + React + TypeScript project named `my-portfolio` with Tailwind CSS, tailwind-variants, Storybook, Vitest, Playwright, Prettier, Makefile and GitHub Actions CI — configured and ready for development.

## Steps

1. **Scaffold project** — run `npm create vite@latest my-portfolio` with React + TypeScript template
2. **Install dependencies** — run `npm install` to install base packages
3. **Add Tailwind CSS** — install `tailwindcss`, `@tailwindcss/vite` and configure via `vite.config.ts`
4. **Configure Tailwind** — add `@import "tailwindcss"` to `src/index.css`, remove boilerplate styles
5. **Add tailwind-variants** — install `tailwind-variants`, create `src/lib/tv.ts` with base config
6. **Add Prettier** — install `prettier`, `prettier-plugin-tailwindcss`, create `.prettierrc` with base config
7. **Add Storybook** — run `npx storybook@latest init`, confirm Vite builder is selected
8. **Add Vitest** — install `vitest`, `@vitest/ui`, configure in `vite.config.ts`
9. **Add Playwright** — run `npx playwright install`, add `playwright.config.ts` with base config
10. **Create Makefile** — create `Makefile` in project root with targets: `dev`, `build`, `lint`, `format`, `format-check`, `test`, `e2e`, `storybook`
11. **Add GitHub Actions workflow** — create `.github/workflows/ci.yml` with separate parallel jobs: `lint`, `format-check`, `test`, `e2e`, `build` — each calls the corresponding Make command; configure branch protection on `main`: merge allowed only after all jobs pass
12. **Clean boilerplate** — strip default Vite demo content from `App.tsx` and `index.css`, leave minimal working shell
13. **Verify setup** — run `make dev`, `make test`, `make format-check` and confirm all pass without errors

## Definition of Done

- [ ] `make dev` starts dev server without errors
- [ ] `make build` completes successfully
- [ ] `make lint` passes without errors
- [ ] `make format-check` passes without errors
- [ ] `make test` runs Vitest without errors
- [ ] `make e2e` runs Playwright without errors
- [ ] `make storybook` opens Storybook in browser
- [ ] `.github/workflows/ci.yml` triggers on `push` and `pull_request`
- [ ] CI contains 5 parallel jobs: `lint`, `format-check`, `test`, `e2e`, `build`
- [ ] Merge into `main` is blocked until all jobs pass
- [ ] Tailwind utility classes render correctly in the browser
- [ ] `tv()` imports from `src/lib/tv.ts` without type errors
- [ ] No leftover Vite boilerplate content in `App.tsx`

## Conventions to Follow

- Package manager: **npm**
- Language: **TypeScript** (strict mode preferred)
- Styling: **Tailwind CSS v4** utility-first
- Component variants: **tailwind-variants** via `src/lib/tv.ts`
- Component stories: **Storybook**, one `.stories.tsx` file next to the component
- Unit tests: **Vitest**, one `.test.ts(x)` file next to the module
- E2e tests: **Playwright**, folder `e2e/`
- Formatting: **Prettier** with `prettier-plugin-tailwindcss`
- CI: **GitHub Actions**, all commands via **Makefile**, jobs run in parallel
