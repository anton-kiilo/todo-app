---
name: cartograph
description: >-
  Refreshes repository orientation docs from the real tree, routes, and
  dependencies: `.cursor/project-map.md` (quick skim) and
  `docs/CODEBASE_MAP.md` (deep module map). Use when the user asks for a
  project map, codebase map, repo map, architecture overview, or Cartograph;
  after refactors that change `app/` routes, providers, or top-level layout.
---

# Cartograph

## Goal

Keep two maps accurate and complementary:

| File | Role |
|------|------|
| `.cursor/project-map.md` | Short orientation: stack, routes, compact tree, one diagram, scripts |
| `docs/CODEBASE_MAP.md` | Longer onboarding: entry points, annotated tree, per-module notes, data flow, mermaid, config tables |

## Workflow

1. **Re-scan** — Inventory `app/`, `screens/`, `components/`, `context/`, `types/`, `hooks/`, `constants/`, and other first-party roots. Read `package.json` (`main`, scripts, key deps), `app/_layout.tsx`, each route under `app/`, and primary screen/context files so descriptions match behavior.
2. **Update `docs/CODEBASE_MAP.md`** — Sync Overview, Entry points, Directory structure, Major modules, Data flow, relationships diagram, Configuration. Paths and screen names must match the repo.
3. **Update `.cursor/project-map.md`** — Brief product/stack summary, routes table, compact source tree, one mental-model mermaid, commands; link to `docs/CODEBASE_MAP.md` for depth.
4. **Cross-check** — If only one doc changes, ensure the other’s “see also” / maintenance lines still point correctly.

## Conventions

- Describe imports with the `@/*` alias as configured in `tsconfig.json`.
- Name routes with **expo-router** paths (e.g. `app/todo/[id].tsx`), not only URL shapes.
- Keep mermaid diagrams small enough to stay readable (~25 nodes or fewer).
- Do not map `node_modules/` or `.expo/` unless explicitly requested.

## Scope

Documentation sync for the two map files. Extend only if the user also asks for code or structural refactors.
