# Refactoring TODOs

This document tracks the progress of the refactoring project using the flat `src/components2` staging strategy.

## Strategy
- **Staging**: `src/components2`.
- **Structure**: Flat directories in `src/components2/pages/` (e.g., `cast-detail`).

## Tasks

- [ ] **Phase 1: Setup & Home Page**
    - [x] Create `src/components2` directory.
    - [x] **Home Page** (`/`) -> `src/components2/pages/home`
        - [x] Create `src/components2/pages/home/index.astro`.
        - [x] Move `HeroSection`, `NewsHeadlineSection`, `CastPickupSection`.
        - [x] Update `src/pages/index.astro`.

- [ ] **Phase 2: Cast Pages**
    - [x] **List** (`/casts`) -> `src/components2/pages/cast-list`
    - [x] **Detail** (`/casts/[id]`) -> `src/components2/pages/cast-detail`

- [ ] **Phase 3: Article Pages**
    - [x] **List** (`/articles`) -> `src/components2/pages/article-list`
    - [x] **Detail** (`/articles/[id]`) -> `src/components2/pages/article-detail`

- [ ] **Phase 4: Guideline Pages**
    - [x] **List** (`/guidelines`) -> `src/components2/pages/guideline-list`
    - [x] **Detail** (`/guidelines/[id]`) -> `src/components2/pages/guideline-detail`

- [x] **Phase 5: Finalize**
    - [x] Rename `src/components2` -> `src/components`.
