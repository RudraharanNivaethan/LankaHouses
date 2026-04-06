# Team Git Workflow

4-member team. `main` is protected — no direct pushes. All changes reach `main` through reviewed pull requests.

---

## Branch naming

```
Sprint<N>/<TaskID>/<YourName>
```

**Examples:**
```
Sprint2/INFRA-05/Vepusanan
Sprint2/PROP-01-B/Tharsigan
Sprint2/PROP-01-F/Sharanjaa
Sprint2/DASH-01-F/Nivaethan              (Any reasonable names but keep sprint number first in branch name.)
```

Rules:
- Always branch from **the latest `main`** (see below).

---

## Daily workflow

### 1. Start a new task — always branch from latest main

```bash
git checkout main
git pull origin main
git checkout -b Sprint2/PROP-01-B/Nivaethan

This ensures your branch starts from the most recent state of `main` and avoids history divergence.

### 2. Work and commit

Make small, focused commits. Each commit should compile and not break the app.

```bash
git add .
git commit -m "Add Property model with Mongoose schema and validation"
```

Write commit messages that explain **why**, not just what:
- Good: `Add Property model with status enum for soft-delete support`
- Bad: `update files`

### 3. Push your branch

```bash
git push -u origin Sprint2/PROP-01-B/Nivaethan
```

Push at least once a day — even if the work is incomplete. This backs up your work and lets others see progress.

### 4. Keep your branch up to date with main

**Do this at least once a day** and always before raising a PR. This is the single most important habit to avoid merge conflicts.

```bash
git checkout main
git pull origin main
git checkout Sprint2/PROP-01-B/Kasun
git rebase main
```

If there are conflicts during rebase:
1. Git will pause and show which files conflict.
2. Open the conflicted files, resolve the conflicts manually.
3. Stage the resolved files: `git add <file>`
4. Continue the rebase: `git rebase --continue`
5. If it gets too messy and you want to abort: `git rebase --abort`

After a rebase, your branch history is rewritten, so you need a force push:

```bash
git push --force-with-lease
```

`--force-with-lease` is safer than `--force` — it refuses to push if someone else has pushed to your branch since your last pull.

### 5. Raise a pull request

When the task is complete and your branch is rebased onto the latest `main`:

```bash
gh pr create --title "PROP-01-B: Add Property model and create endpoint" --body "..."
```

Or use the GitHub web UI. In the PR description:
- Reference the task ID (e.g. `PROP-01-B`)
- Summarize what was built
- List anything the reviewer should test

### 6. After PR is merged

Once I merge your PR into `main`, clean up:

```bash
git checkout main
git pull origin main
git branch -d Sprint2/PROP-01-B/Kasun          # delete local branch
git push origin --delete Sprint2/PROP-01-B/Kasun  # delete remote branch
```

Then start your next task from the fresh `main`.

---

## The golden rules

| Rule | Why |
|---|---|
| Always branch from the latest `main` | Prevents your branch from starting behind and becoming incompatible |
| Rebase onto `main` daily | Keeps your branch's history linear and catches conflicts early when they're small |
| Never merge `main` into your branch | Merge commits create non-linear history. Always **rebase** instead |
| One task per branch | Keeps PRs small, reviewable, and independently mergeable |
| Push daily | Backs up your work and makes progress visible to the team |
| Never force-push to `main` | Only the project lead merges to `main` via PR |

---

## What the project lead (reviewer) does

1. Check that the PR branch is rebased onto the latest `main` (no merge commits, clean history).
2. Review the code.
3. **Squash and merge** the PR on GitHub — this collapses all commits into a single clean commit on `main`.
4. Delete the remote branch after merge.

---

## Handling common situations

### "My branch is behind main and has conflicts"

```bash
git checkout main
git pull origin main
git checkout your-branch
git rebase main
# resolve conflicts if any
git push --force-with-lease
```

### "I need someone else's work that isn't on main yet"

Wait for their PR to be merged into `main`, then rebase your branch onto `main`. Do **not** merge their branch directly into yours — that creates tangled history.

If you absolutely cannot wait (rare), coordinate with the other developer and rebase onto their branch temporarily. But be aware you'll need to rebase again once their work lands on `main`.

### "I accidentally committed to main"

```bash
git checkout main
git reset --soft HEAD~1        # undo the commit, keep the changes staged
git stash                      # stash the changes
git checkout -b Sprint2/TASK/Name
git stash pop                  # apply the changes to the new branch
git commit -m "your message"
```

### "I want to discard my branch and start over"

```bash
git checkout main
git pull origin main
git branch -D old-branch-name   # force delete local branch
git checkout -b Sprint2/TASK/Name
```

---

## Quick reference

```bash
# Start a task
git checkout main && git pull origin main
git checkout -b Sprint2/TASK-ID/YourName

# Save work
git add . && git commit -m "meaningful message"
git push -u origin Sprint2/TASK-ID/YourName

# Stay current (do this daily)
git checkout main && git pull origin main
git checkout Sprint2/TASK-ID/YourName
git rebase main
git push --force-with-lease

# Raise PR
gh pr create --title "TASK-ID: Short description" --body "Summary of changes"

# After PR is merged
git checkout main && git pull origin main
git branch -d Sprint2/TASK-ID/YourName
git push origin --delete Sprint2/TASK-ID/YourName
```
