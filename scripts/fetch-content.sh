#!/bin/bash
# Fetch content repo on build
set -e

CONTENT_REPO="${CONTENT_REPO:-}"
CONTENT_DIR="src/content"

if [ -z "$CONTENT_REPO" ]; then
  echo "CONTENT_REPO not set, skipping content fetch"
  exit 0
fi

if [ -d "$CONTENT_DIR/.git" ]; then
  echo "Updating content submodule..."
  git submodule update --remote "$CONTENT_DIR"
else
  echo "Cloning content repo..."
  git clone "$CONTENT_REPO" "$CONTENT_DIR"
fi

echo "Content repo ready."
