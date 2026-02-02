# YouTube 영상 좋아요/싫어요 비율 분석 - React 버전

## 프로젝트 개요

React.js와 Vite를 사용하여 구축된 YouTube 영상 좋아요/싫어요 비율 분석 웹 애플리케이션입니다.

## 기술 스택

- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **Chart.js** - 차트 시각화
- **React ChartJS 2** - Chart.js React 래퍼

## 설치 및 실행

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

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

### 4. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 5. 빌드 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── SearchSection.jsx
│   ├── Loading.jsx
│   ├── ErrorMessage.jsx
│   ├── Summary.jsx
│   ├── Charts.jsx
│   ├── VideoList.jsx
│   └── Footer.jsx
├── services/           # API 서비스
│   └── api.js
├── App.jsx            # 메인 앱 컴포넌트
├── App.css
├── main.jsx           # 진입점
└── index.css          # 전역 스타일
```

## GitHub Pages 배포

### 방법 1: GitHub Actions 자동 배포 (권장)

1. **저장소 설정**
   - GitHub에 저장소 생성
   - Settings > Pages에서 GitHub Actions를 소스로 선택

2. **환경 변수 설정 (선택사항)**
   - Settings > Secrets and variables > Actions
   - `VITE_YOUTUBE_API_KEY` 추가 (선택사항, 빌드 시점에 주입)

3. **vite.config.js 수정**
   ```javascript
   // 저장소 이름에 맞게 base 경로 설정
   base: '/your-repo-name/'
   ```

4. **코드 푸시**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

5. **자동 배포**
   - GitHub Actions가 자동으로 빌드 및 배포
   - Actions 탭에서 진행 상황 확인

### 방법 2: 수동 배포

1. **빌드**
   ```bash
   npm run build
   ```

2. **dist 폴더 내용을 GitHub Pages에 업로드**
   - gh-pages 브랜치 사용
   - 또는 GitHub Pages 설정에서 dist 폴더 선택

## 환경 변수 관리

### 개발 환경

`.env` 파일에 설정:
```
VITE_YOUTUBE_API_KEY=your_api_key
```

### 프로덕션 환경

⚠️ **주의**: 클라이언트 사이드 React 앱에서는 환경 변수가 빌드 시점에 번들에 포함됩니다.

**옵션 1: 빌드 시점에 주입**
- GitHub Secrets에 저장
- GitHub Actions에서 빌드 시 주입

**옵션 2: 런타임에 입력받기 (권장)**
- 현재 구현: 사용자가 웹 페이지에서 직접 입력
- API 키는 localStorage에 저장
- 더 안전한 방법

**옵션 3: 백엔드 프록시**
- API 키를 서버에서 관리
- 클라이언트는 서버 API를 호출
- 가장 안전한 방법

## API 키 보안

### 현재 구현 방식

- API 키는 `.env` 파일에서 개발 시 사용
- 프로덕션에서는 사용자가 직접 입력 (localStorage 저장)
- 또는 GitHub Secrets에서 빌드 시 주입

### 보안 권장사항

1. **HTTP 리퍼러 제한 설정**
   - Google Cloud Console에서 API 키 설정
   - 허용 도메인: `https://[사용자명].github.io/*`

2. **API 키 할당량 제한**
   - Google Cloud Console에서 일일 할당량 설정

3. **백엔드 프록시 사용 (프로덕션 권장)**
   - API 키를 서버에서만 관리
   - 클라이언트는 서버 API를 통해 요청

## 주요 기능

- ✅ YouTube API 검색
- ✅ Return YouTube Dislike API 연동
- ✅ 4가지 차트 시각화
- ✅ 반응형 디자인
- ✅ 환경 변수 관리
- ✅ GitHub Pages 배포 지원

## 문제 해결

### 환경 변수가 작동하지 않음

- 환경 변수 이름이 `VITE_`로 시작하는지 확인
- 개발 서버 재시작 필요
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

## 라이선스

MIT License
