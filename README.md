# YouTube 영상 좋아요/싫어요 비율 분석

React.js와 Vite를 사용하여 구축된 YouTube 영상 좋아요/싫어요 비율 분석 웹 애플리케이션입니다.

## 프로젝트 개요

이 프로젝트는 YouTube API를 사용하여 검색어 관련 영상 리스트를 가져오고, Return YouTube Dislike API를 통해 각 영상의 좋아요/싫어요 비율을 시각화하는 도구입니다.

## 주요 기능

1. **YouTube 검색**: 검색어를 입력하여 관련 영상 리스트 수집
2. **좋아요/싫어요 데이터 수집**: Return YouTube Dislike API를 통해 각 영상의 반응 데이터 조회
3. **시각화**: 수집한 데이터를 4가지 차트로 시각화하여 비교 분석
4. **환경 변수 관리**: `.env` 파일을 통한 API 키 관리

## 기술 스택

- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **Chart.js** - 차트 시각화
- **React ChartJS 2** - Chart.js React 래퍼

## 프로젝트 구조

```
youtube-dislike-analyzer/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── SearchSection.jsx
│   │   ├── Loading.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Summary.jsx
│   │   ├── Charts.jsx
│   │   ├── VideoList.jsx
│   │   └── Footer.jsx
│   ├── services/            # API 서비스
│   │   └── api.js
│   ├── App.jsx              # 메인 앱 컴포넌트
│   ├── App.css
│   ├── main.jsx             # 진입점
│   └── index.css            # 전역 스타일
├── package.json             # npm 의존성
├── vite.config.js           # Vite 설정
├── .env                     # 환경 변수 (API 키)
├── .env.example             # 환경 변수 예시
└── .github/workflows/       # GitHub Actions
    └── deploy-react.yml
```

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 YouTube API 키를 설정하세요:

```bash
cp .env.example .env
```

`.env` 파일 편집:
```
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
```

⚠️ **중요**: Vite에서는 환경 변수 이름이 `VITE_`로 시작해야 클라이언트에서 접근 가능합니다.

### 3. YouTube API 키 발급

**자세한 설정 가이드는 [YOUTUBE_API_SETUP.md](./YOUTUBE_API_SETUP.md)를 참조하세요.**

간단한 요약:
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리"에서 "YouTube Data API v3" 검색 및 활성화
4. "사용자 인증 정보" > "API 키 만들기"
5. API 키 복사하여 `.env` 파일에 입력

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

### 5. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

## 📊 시각화 종류

1. **좋아요/싫어요 막대 그래프**: 각 영상별 좋아요/싫어요 수 비교 (누적)
2. **좋아요 비율 막대 그래프**: 좋아요 비율을 색상으로 구분하여 표시
3. **산점도**: 좋아요 vs 싫어요 관계 (점 크기 = 총 반응 수, 색상 = 좋아요 비율)
4. **히스토그램**: 좋아요 비율 분포

## 🌐 GitHub Pages 배포

**배포 URL**: https://kimchunyong.github.io/youtubDisLikeSearch/

### 방법 1: GitHub Actions 자동 배포 (권장)

1. **원격 저장소 연결 및 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/kimchunyong/youtubDisLikeSearch.git
   git branch -M main
   git push -u origin main
   ```
   **에러가 날 때**: `git remote set-url` 은 **이미 있는** origin 의 URL 만 바꿀 수 있습니다.  
   - 아직 `git init` 을 안 했다면 → 위에서 `git init` 부터 순서대로 실행하세요.  
   - origin 이 없다면 → `git remote add origin https://github.com/kimchunyong/youtubDisLikeSearch.git` 사용 (set-url 대신 add).  
   - 이미 origin 이 있고 URL 만 바꾸려면 → `git remote set-url origin https://github.com/kimchunyong/youtubDisLikeSearch.git` 후 `git push -u origin main`.

2. **GitHub Pages 설정 (필수)**  
   - 저장소 **Settings** → **Pages**
   - **Build and deployment** → **Source**: **GitHub Actions** 선택  
   - 이 단계를 하지 않으면 Actions에서 "Get Pages site failed" / "HttpError: Not Found" 가 발생합니다.

3. **자동 배포**
   - `main` 브랜치에 푸시할 때마다 `.github/workflows/deploy-react.yml`이 빌드 후 GitHub Pages에 배포
   - (선택) YouTube API 키 사용 시: **Settings** → **Secrets and variables** → **Actions** 에 `VITE_YOUTUBE_API_KEY` 추가

4. **로컬에서 GitHub Pages용 빌드 확인**
   ```bash
   npm run build:pages
   npm run preview
   ```
   → `https://kimchunyong.github.io/youtubDisLikeSearch/` 와 동일한 base 경로로 빌드됨

### 방법 2: 수동 배포

1. **빌드**
   ```bash
   npm run build
   ```

2. **gh-pages 브랜치에 배포**
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

## 🔐 환경 변수 관리

### 개발 환경

`.env` 파일에 설정:
```
VITE_YOUTUBE_API_KEY=your_api_key
```

### 프로덕션 환경

⚠️ **주의**: 클라이언트 사이드 React 앱에서는 환경 변수가 빌드 시점에 번들에 포함됩니다.

**옵션 1: GitHub Secrets (빌드 시 주입)**
- Settings > Secrets and variables > Actions
- `VITE_YOUTUBE_API_KEY` 추가
- GitHub Actions에서 빌드 시 자동 주입

**옵션 2: 런타임 입력 (추가 구현 가능)**
- 사용자가 웹 페이지에서 직접 입력
- localStorage에 저장
- 더 안전하지만 사용자 경험이 다소 불편

**옵션 3: 백엔드 프록시 (가장 안전)**
- API 키를 서버에서만 관리
- 클라이언트는 서버 API를 호출
- 별도 백엔드 서버 필요

## 🔒 API 키 보안

### 보안 권장사항

1. **HTTP 리퍼러 제한 설정**
   - Google Cloud Console에서 API 키 설정
   - 허용 도메인: `https://[사용자명].github.io/*`
   - 로컬 개발용: `http://localhost:*`

2. **API 키 할당량 제한**
   - Google Cloud Console에서 일일 할당량 설정

3. **백엔드 프록시 사용 (프로덕션 권장)**
   - API 키를 서버에서만 관리
   - 클라이언트는 서버 API를 통해 요청

## 📚 API 설명

### YouTube Data API v3
- **엔드포인트**: `https://www.googleapis.com/youtube/v3/search`
- **주요 파라미터**:
  - `q`: 검색어
  - `maxResults`: 최대 결과 수 (기본값: 10)
  - `order`: 정렬 기준 (relevance, date, rating, viewCount, title, videoCount)
  - `part`: 'snippet' (메타데이터 포함)

### Return YouTube Dislike API
- **엔드포인트**: `https://returnyoutubedislike.com/api/votes?videoId={video_id}`
- **응답 형식**:
  ```json
  {
    "id": "video_id",
    "dateCreated": "timestamp",
    "likes": 12345,
    "dislikes": 678,
    "rating": 0.947,
    "viewCount": 1000000
  }
  ```

## ⚠️ 주의사항

### YouTube API 할당량

- **기본 할당량**: 10,000 units/일
- **검색 요청**: 100 units/요청
- **하루 약 100번의 검색**만 가능합니다

**할당량 초과 오류 발생 시:**
- 24시간 후 다시 시도
- Google Cloud Console에서 할당량 증가 요청
- 검색 결과 수 줄이기 (maxResults 감소)
- 여러 API 키 사용 (로테이션)

자세한 내용은 [QUOTA_GUIDE.md](./QUOTA_GUIDE.md)를 참조하세요.

### 기타 주의사항

- Return YouTube Dislike API는 공개 API이지만 과도한 요청 시 제한될 수 있습니다
- `.env` 파일은 절대 공개 저장소에 커밋하지 마세요 (이미 .gitignore에 포함)
- 환경 변수는 빌드 시점에 번들에 포함되므로 프로덕션에서는 주의 필요

## 🛠️ 문제 해결

### 환경 변수가 작동하지 않음

- 환경 변수 이름이 `VITE_`로 시작하는지 확인
- 개발 서버 재시작 필요 (`npm run dev`)
- `.env` 파일이 프로젝트 루트에 있는지 확인

### 빌드 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### GitHub Pages에서 404 오류

- `vite.config.js`의 `base` 경로 확인
- 저장소 이름과 일치하는지 확인
- 빌드된 파일이 `dist/` 폴더에 있는지 확인

## 📖 추가 문서

- [YOUTUBE_API_SETUP.md](./YOUTUBE_API_SETUP.md) - YouTube API 설정 상세 가이드 ⭐
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 403 할당량 오류 해결 가이드 🔧
- [REACT_README.md](./REACT_README.md) - React 버전 상세 문서
- [SETUP.md](./SETUP.md) - 설정 가이드
- [QUOTA_GUIDE.md](./QUOTA_GUIDE.md) - 할당량 초과 오류 해결 가이드

## 📝 스크립트 명령어

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드 미리보기

## 📄 라이선스

MIT License
