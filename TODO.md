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
    - [ ] **Detail** (`/casts/[id]`) -> `src/components2/pages/cast-detail`

- [ ] **Phase 3: Article Pages**
    - [ ] **List** (`/articles`) -> `src/components2/pages/article-list`
    - [ ] **Detail** (`/articles/[id]`) -> `src/components2/pages/article-detail`

- [ ] **Phase 4: Guideline Pages**
    - [ ] **List** (`/guidelines`) -> `src/components2/pages/guideline-list`
    - [ ] **Detail** (`/guidelines/[id]`) -> `src/components2/pages/guideline-detail`

- [ ] **Phase 5: Finalize**
    - [ ] Rename `src/components2` -> `src/components`.
