#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "[1/5] Check git changes"
if git diff --quiet && git diff --cached --quiet; then
  echo "No changes to commit"
else
  echo "[2/5] Commit changes with date"
  git add -A
  git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo "[3/5] Run package"
npm run package

echo "[4/5] Sync public to /Library/WebServer/Documents"
sudo rsync -a --delete "$PROJECT_ROOT/public/" /Library/WebServer/Documents/

echo "[5/5] Restart macOS built-in web server"
sudo apachectl restart

echo "Deploy completed"
