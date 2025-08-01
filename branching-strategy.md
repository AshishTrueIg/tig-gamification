# Branching Strategy

## Overview
This document outlines the Git branching strategy for maintaining a structured and efficient workflow in our Express project.

## Branching Model
We follow a **feature-based branching model** inspired by Git Flow but simplified for faster development and deployment.

### Main Branches

| Branch   | Purpose |
|----------|---------|
| `main`   | Stable production-ready branch. Only tested and approved code is merged here. |
| `develop` | Active development branch. All new features and bug fixes are merged here before moving to `main`. |

### Supporting Branches

| Branch Type | Naming Convention         | Purpose |
|-------------|--------------------------|---------|
| **Feature** | `feature/{feature-name}`  | For new features or enhancements. Merged into `develop` when complete. |
| **Bugfix**  | `bugfix/{issue-name}`     | For fixing bugs in the `develop` branch. |
| **Hotfix**  | `hotfix/{issue-name}`     | For urgent fixes on `main`. Merged into `main` and `develop`. |
| **Release** | `release/{version}`       | For preparing production releases. Used for final testing and documentation updates. |

## Workflow

### 1. Feature Development
1. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/{feature-name}
   ```
2. Develop and commit changes following the coding guidelines.
3. Push the branch and create a **pull request (PR) to `develop`**.

### 2. Bug Fixing
- Minor bug fixes: Fix directly in `develop` (`bugfix/{issue-name}`).  
- Critical production issues: Create a `hotfix/{issue-name}` from `main`, then merge into `main` and `develop`.  

### 3. Release Process
1. When `develop` is stable, create a `release/{version}` branch.
2. Perform testing, final documentation updates, and versioning.
3. Merge into `main` and tag the release:
   ```bash
   git checkout main
   git merge release/{version}
   git tag -a vX.X.X -m "Release vX.X.X"
   git push origin main --tags
   ```
4. Merge back into `develop` to keep it updated.

### 4. Hotfixes (Critical Production Issues)
1. Create a branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/{issue-name}
   ```
2. Fix the issue and push changes.
3. Merge into both `main` and `develop` to keep them in sync.

## Best Practices
✅ Keep `main` and `develop` always deployable.  
✅ Write meaningful commit messages.  
✅ Use PR reviews before merging into `develop` or `main`.  
✅ Rebase feature branches before merging to avoid conflicts.  
✅ Delete merged branches after PR approval.  

---

This strategy ensures a clean, structured, and efficient workflow.
