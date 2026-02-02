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

## 5. 사이트 소유 확인(검증)이 안 될 때

검증용 스니펫은 **반드시 `index.html`의 `<head>` 안**에 있어야 합니다. `AdSense.jsx`(또는 Ads.tsx)는 **광고 표시용**이라, 검증 코드를 컴포넌트에만 넣으면 Google 봇이 인식하지 못합니다.

### 체크리스트

1. **배포된 URL에서만 검증 가능**
   - 로컬(`localhost`)에서는 Google이 접근할 수 없습니다.
   - `main` 브랜치 푸시 후 GitHub Actions 배포가 끝난 뒤, **실제 사이트 URL**  
     `https://kimchunyong.github.io/youtubDisLikeSearch/` 에서만 "검증" 버튼을 눌러야 합니다.

2. **AdSense에 등록한 URL과 일치**
   - 사이트 추가 시 입력한 URL이  
     `https://kimchunyong.github.io/youtubDisLikeSearch` 또는  
     `https://kimchunyong.github.io/youtubDisLikeSearch/`  
     와 **정확히 같아야** 합니다 (끝에 `/` 유무, `http` vs `https` 확인).

3. **검증 코드는 index.html에**
   - 이 프로젝트에는 이미 `index.html`의 `<head>`에  
     `<meta name="google-adsense-account" content="ca-pub-xxxxx" />` 와  
     `adsbygoogle.js` 스크립트가 들어가 있습니다.
   - AdSense에서 **다른 형태의 스니펫**(예: 스크립트 태그)을 주었다면, 그 코드를 **그대로** `index.html`의 `<head>` 안에 추가하세요.

4. **배포된 페이지에서 meta 확인**
   - 배포된 사이트를 연 뒤 **개발자 도구 → Elements** 에서 `<head>` 안에  
     `google-adsense-account` meta 태그가 **초기 HTML**에 보이는지 확인하세요. (React로 나중에 넣은 게 아니어야 함)

5. **시간**
   - 검증 후 승인까지 24시간~며칠 걸릴 수 있습니다. 한두 번 "다시 확인" 후 기다려 보세요.

6. **ads.txt (선택)**
   - 도메인 권한/광고 판매자 확인용으로 `ads.txt`를 쓰는 경우,  
     `public/ads.txt` 파일을 두면 빌드 시 사이트 루트(`/ads.txt`)로 복사됩니다.  
     AdSense에서 안내하는 `ads.txt` 한 줄을 그대로 `public/ads.txt`에 넣으면 됩니다.

## 6. 주의사항

- AdSense 정책을 지키세요 (클릭 유도, 과도한 광고 개수 등 금지).
- `.env` 와 GitHub Secrets 에는 실제 `ca-pub-` 값만 넣고, 이 파일(ADSENSE.md)에는 예시 값만 기재하는 것이 좋습니다.
