#!/bin/bash
# 拉取内容仓库 — 文章同步到 src/content/posts/，图片同步到 public/images/
set -e

CONTENT_REPO="${CONTENT_REPO:-}"
CACHE_DIR=".content-cache"
POSTS_DIR="src/content/posts"
IMAGES_DIR="public/images"

if [ -z "$CONTENT_REPO" ]; then
  echo "[fetch-content] CONTENT_REPO not set, skipping"
  exit 0
fi

# 克隆 / 更新内容仓库到缓存目录
if [ -d "$CACHE_DIR/.git" ]; then
  echo "[fetch-content] Updating content repo..."
  git -C "$CACHE_DIR" pull --ff-only
else
  echo "[fetch-content] Cloning content repo..."
  git clone --depth 1 "$CONTENT_REPO" "$CACHE_DIR"
fi

# 同步文章
if [ -d "$CACHE_DIR/posts" ]; then
  echo "[fetch-content] Syncing posts..."
  rm -rf "$POSTS_DIR"
  cp -r "$CACHE_DIR/posts" "$POSTS_DIR"
fi

# 同步图片
if [ -d "$CACHE_DIR/images" ]; then
  echo "[fetch-content] Syncing images..."
  mkdir -p "$IMAGES_DIR"
  cp -r "$CACHE_DIR/images/"* "$IMAGES_DIR/"
fi

echo "[fetch-content] Done."
