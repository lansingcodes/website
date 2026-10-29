#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
firebase_bin="${FIREBASE_BIN:-$(command -v firebase || true)}"
if [[ -z "$firebase_bin" ]]; then
  echo 'Install the Firebase CLI or set FIREBASE_BIN to its executable.' >&2
  exit 1
fi

cd "$root"
"$firebase_bin" emulators:exec \
  --only firestore \
  --project demo-lansingcodes \
  --config firebase.json \
  'FIREBASE_PROJECT_ID=demo-lansingcodes ./node_modules/.bin/tsx dev-tools/sync-safety-smoke.ts'
