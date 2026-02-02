#!/usr/bin/env bash
# youtubDisLikeSearch 원격 저장소 연결 및 첫 푸시
# 사용법: ./scripts/github-setup.sh

set -e
cd "$(dirname "$0")/.."
REPO="https://github.com/kimchunyong/youtubDisLikeSearch.git"

if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "Git 저장소가 없습니다. git init 실행..."
  git init
fi

if git remote get-url origin > /dev/null 2>&1; then
  echo "origin URL을 $REPO 로 변경합니다."
  git remote set-url origin "$REPO"
else
  echo "origin 원격을 추가합니다."
  git remote add origin "$REPO"
fi

git add .
git status
echo "---"
echo "커밋이 없으면 아래로 첫 커밋 후 푸시하세요:"
echo "  git commit -m \"Initial commit: YouTube Dislike Search\""
echo "  git branch -M main"
echo "  git push -u origin main"
echo "이미 커밋이 있으면:"
echo "  git branch -M main"
echo "  git push -u origin main"
