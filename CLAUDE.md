# CLAUDE.md

Инструкции для Claude при работе в этом репозитории.

## Workflow

Когда пользователь даёт задачу в виде файла `plans/NN-*.md`:

1. Прочитать файл плана полностью, без действий.
2. При неясностях — задать вопросы через `AskUserQuestion` (label + 1 строка описания, 2–4 варианта).
3. Создать `TaskCreate` по шагам плана, выполнять последовательно, обновлять статус (`in_progress` → `completed`).
4. После каждого значимого изменения — быстрые проверки: `make lint`, `make format-check`, `make test`.
5. По завершении всех шагов — `make ci` (агрегат: format-check → lint → test → build → e2e).
6. Финальный смок: `make ci-act` (полный прогон `.github/workflows/ci.yml` в Docker через `act`).
7. Показать `git status` + `git diff --stat`. **Не коммитить и не пушить.**
8. По команде пользователя (`commit` / `PR`) — создать ветку `feat/NN-<slug>` или `chore/NN-<slug>`, коммит, push, открыть PR через `gh pr create`.

## Команды

- `make dev` — Vite dev server (порт 5173)
- `make ci` — полная локальная проверка без Docker
- `make ci-act` — то же через Docker (точная репродукция GitHub Actions)
- `make format` — Prettier write (применить форматирование)
- `make storybook` — Storybook dev server (порт 6006)

## Правила

- **Никогда не коммитить и не пушить без явной команды** пользователя.
- **Никогда не пушить в `main` напрямую** — только через PR из ветки. На `main` включена branch protection: 5 required checks (`lint`, `format-check`, `test`, `e2e`, `build`).
- **PR-per-plan**: каждый файл `plans/NN-*.md` = отдельная ветка + отдельный PR.
- **Падающие локальные проверки чинить самостоятельно**, спрашивать только если нужна смена подхода.
- **Никогда не коммитить секреты**: `.claude/credentials.json` в `.gitignore`, любые токены/ключи держать вне репо.
- **Не пропускать git hooks** (`--no-verify` и т.п.) без явной просьбы пользователя.
