.PHONY: dev build lint format format-check test test-watch e2e e2e-install storybook storybook-build storybook-test ci ci-act install clean ports-kill

PORT_DEV ?= 5173
PORT_E2E ?= 4173
PORT_STORYBOOK ?= 6006

# Kill any process holding our well-known ports. Safe to run anytime; errors ignored.
ports-kill:
	@for p in $(PORT_DEV) $(PORT_E2E) $(PORT_STORYBOOK); do \
	  if command -v fuser >/dev/null 2>&1; then \
	    fuser -k -TERM $$p/tcp 2>/dev/null || true; \
	  else \
	    lsof -ti tcp:$$p 2>/dev/null | xargs -r kill -TERM 2>/dev/null || true; \
	  fi; \
	done

install:
	npm ci

dev:
	@trap '$(MAKE) -s ports-kill' EXIT INT TERM; \
	  npx vite --port $(PORT_DEV) --strictPort

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
	@trap '$(MAKE) -s ports-kill' EXIT INT TERM; \
	  E2E_PORT=$(PORT_E2E) npx playwright test

e2e-install:
	npx playwright install --with-deps

storybook:
	@trap '$(MAKE) -s ports-kill' EXIT INT TERM; \
	  npx storybook dev -p $(PORT_STORYBOOK) --no-open

storybook-build:
	npm run build-storybook

ci: ports-kill format-check lint test build e2e

ci-act:
	act -W .github/workflows/ci.yml --container-architecture linux/amd64

clean:
	rm -rf node_modules dist storybook-static playwright-report test-results coverage
