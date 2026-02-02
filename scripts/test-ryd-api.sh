#!/usr/bin/env bash
# Return YouTube Dislike API curl 테스트
# 사용법: ./scripts/test-ryd-api.sh

BASE="https://returnyoutubedislike.com/api"

echo "=== 1. /votes?videoId=LYp3BVLVTNs (요청하신 영상) ==="
curl -s -w "\nHTTP_CODE: %{http_code}\n" "${BASE}/votes?videoId=LYp3BVLVTNs"
echo ""

echo "=== 2. /votes?videoId=dQw4w9WgXcQ (RYD에 데이터 있을 가능성 높은 영상) ==="
curl -s -w "\nHTTP_CODE: %{http_code}\n" "${BASE}/votes?videoId=dQw4w9WgXcQ"
echo ""

echo "=== 3. /votes?videoId=Kx6Sgmj2vVU (이전에 쓰신 영상 ID) ==="
curl -s -w "\nHTTP_CODE: %{http_code}\n" "${BASE}/votes?videoId=Kx6Sgmj2vVU"
