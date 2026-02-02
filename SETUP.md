# React 프로젝트 설정 가이드

## 초기 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 YouTube API 키를 설정하세요:

```bash
# .env 파일 생성
touch .env
```

`.env` 파일 내용:
```
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
```

⚠️ **중요 사항**:
- Vite에서는 환경 변수 이름이 반드시 `VITE_`로 시작해야 합니다
- `.env` 파일은 Git에 커밋하지 마세요 (이미 .gitignore에 포함됨)
- `.env.example` 파일을 참고하세요

### 3. YouTube API 키 발급

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

## GitHub Pages 배포 설정

### vite.config.js 수정

저장소 이름에 맞게 `base` 경로를 설정하세요:

```javascript
// 예: 저장소 이름이 'youtube-dislike-analyzer'인 경우
base: '/youtube-dislike-analyzer/'

// 루트 도메인에 배포하는 경우
base: '/'
```

또는 환경 변수로 설정:

```bash
# .env 파일에 추가
REPO_NAME=youtube-dislike-analyzer
```

### GitHub Actions 배포

1. **저장소 생성 및 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/[사용자명]/[저장소명].git
   git push -u origin main
   ```

2. **GitHub Pages 설정**
   - 저장소 Settings > Pages
   - Source: "Deploy from a branch" 또는 "GitHub Actions"
   - Branch: `gh-pages` 또는 Actions 사용

3. **자동 배포**
   - `.github/workflows/deploy-react.yml`이 자동으로 배포 처리
   - 코드 푸시 시 자동 빌드 및 배포

## 환경 변수 관리 방법

### 개발 환경

`.env` 파일 사용:
```
VITE_YOUTUBE_API_KEY=your_api_key
```

### 프로덕션 환경

**옵션 1: GitHub Secrets (빌드 시 주입)**
- Settings > Secrets and variables > Actions
- `VITE_YOUTUBE_API_KEY` 추가
- GitHub Actions에서 빌드 시 자동 주입

**옵션 2: 런타임 입력 (현재 구현)**
- 사용자가 웹 페이지에서 직접 입력
- localStorage에 저장
- 더 안전하지만 사용자 경험이 다소 불편

**옵션 3: 백엔드 프록시 (가장 안전)**
- API 키를 서버에서만 관리
- 클라이언트는 서버 API를 호출
- 별도 백엔드 서버 필요

## 문제 해결

### 환경 변수가 작동하지 않음

1. 환경 변수 이름이 `VITE_`로 시작하는지 확인
2. 개발 서버 재시작 (`npm run dev`)
3. `.env` 파일이 프로젝트 루트에 있는지 확인
4. 빌드 시에는 `.env` 파일이 필요 없음 (이미 번들에 포함됨)

### 빌드 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### GitHub Pages 404 오류

1. `vite.config.js`의 `base` 경로 확인
2. 저장소 이름과 일치하는지 확인
3. 빌드된 파일이 `dist/` 폴더에 있는지 확인

### API 키 보안

⚠️ **중요**: React 앱은 클라이언트 사이드이므로 환경 변수가 빌드 시점에 번들에 포함됩니다.

**보안 권장사항**:
1. Google Cloud Console에서 HTTP 리퍼러 제한 설정
2. API 키 할당량 제한 설정
3. 프로덕션에서는 백엔드 프록시 사용 권장

## 스크립트 명령어

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드 미리보기

## 추가 리소스

- [Vite 문서](https://vitejs.dev/)
- [React 문서](https://react.dev/)
- [Chart.js 문서](https://www.chartjs.org/)
