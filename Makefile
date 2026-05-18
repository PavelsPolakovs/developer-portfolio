.PHONY: dev build lint format format-check test test-watch e2e e2e-install storybook storybook-build storybook-test ci ci-act install clean

install:
	npm ci

dev:
	npm run dev

build:
	npm run build

lint:
	npx tsc --noEmit
	npx eslint .

format:
	npx prettier --write .

format-check:
	npx prettier --check .

test:
	npx vitest run

test-watch:
	npx vitest

e2e:
	npx playwright test

e2e-install:
	npx playwright install --with-deps

storybook:
	npm run storybook

storybook-build:
	npm run build-storybook

ci: format-check lint test build e2e

ci-act:
	act -W .github/workflows/ci.yml --container-architecture linux/amd64

clean:
	rm -rf node_modules dist storybook-static playwright-report test-results coverage
