# Google AdSense 설정 가이드

https://kimchunyong.github.io/youtubDisLikeSearch/ 에 Google AdSense를 넣는 방법입니다.

## 1. AdSense 가입 및 사이트 등록

1. [Google AdSense](https://www.google.com/adsense/) 접속 후 로그인
2. **사이트** → **사이트 추가** 에서 `https://kimchunyong.github.io` 또는 `https://kimchunyong.github.io/youtubDisLikeSearch/` 입력
3. 안내에 따라 **사이트 소유 확인** (메타 태그 또는 HTML 파일 방식)
4. 검토 후 승인되면 **광고 단위** 생성 가능

## 2. 광고 단위 만들기

1. AdSense 대시보드 → **광고** → **광고 단위별**
2. **디스플레이 광고** 등 원하는 유형 선택 후 광고 단위 생성
3. 생성 후 **광고 단위 ID** (숫자, 예: `1234567890`) 와 **게시자 ID** (`ca-pub-XXXXXXXXXXXXXXXX`) 확인

## 3. 프로젝트에 적용

### 로컬 / 환경 변수

프로젝트 루트 `.env` 파일에 다음을 추가합니다.

```env
VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_SLOT=1234567890
```

- `VITE_ADSENSE_CLIENT`: AdSense **게시자 ID** (`ca-pub-` 로 시작)
- `VITE_ADSENSE_SLOT`: 생성한 **광고 단위 ID** (숫자)

저장 후 `npm run dev` 로 실행하면 검색 폼 아래에 광고가 표시됩니다.

### GitHub Pages (배포)

배포 시에도 같은 값이 필요합니다.

1. 저장소 **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 로 추가:
   - Name: `VITE_ADSENSE_CLIENT`  
   - Value: `ca-pub-XXXXXXXXXXXXXXXX`
3. 같은 방식으로 `VITE_ADSENSE_SLOT` 추가 (Value: 광고 단위 ID)

4. `.github/workflows/deploy-react.yml` 의 **Build** 단계 `env` 에 다음이 있어야 합니다 (이미 있으면 수정만):

```yaml
env:
  REPO_NAME: youtubDisLikeSearch
  VITE_YOUTUBE_API_KEY: ${{ secrets.VITE_YOUTUBE_API_KEY || '' }}
  VITE_ADSENSE_CLIENT: ${{ secrets.VITE_ADSENSE_CLIENT || '' }}
  VITE_ADSENSE_SLOT: ${{ secrets.VITE_ADSENSE_SLOT || '' }}
```

위처럼 추가한 뒤 `main` 에 푸시하면 배포 시 AdSense가 적용됩니다.

## 4. 광고 위치 변경

`src/App.jsx` 에서 `<AdSense />` 위치를 바꾸면 됩니다.

- 검색 폼 아래 (현재): `<SearchSection />` 다음
- 결과 아래: `<VideoList />` 다음
- 푸터 위: `<Footer />` 위

여러 개 넣으려면 `<AdSense slot="다른광고단위ID" />` 처럼 `slot` prop 을 다르게 주면 됩니다. (그때는 `VITE_ADSENSE_SLOT` 대신 각 광고 단위 ID를 prop 으로 전달)

## 5. 주의사항

- AdSense 정책을 지키세요 (클릭 유도, 과도한 광고 개수 등 금지).
- `.env` 와 GitHub Secrets 에는 실제 `ca-pub-` 값만 넣고, 이 파일(ADSENSE.md)에는 예시 값만 기재하는 것이 좋습니다.
