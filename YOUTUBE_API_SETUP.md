# YouTube Data API v3 설정 가이드

Google Cloud Console에서 YouTube Data API v3를 설정하고 사용하는 방법을 안내합니다.

## 1단계: Google Cloud 프로젝트 생성

### 1.1 Google Cloud Console 접속

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Google 계정으로 로그인

### 1.2 새 프로젝트 생성

1. 상단의 프로젝트 선택 드롭다운 클릭
2. "새 프로젝트" 클릭
3. 프로젝트 정보 입력:
   - **프로젝트 이름**: 예) `youtube-dislike-analyzer`
   - **조직**: 선택사항
   - **위치**: 선택사항
4. "만들기" 클릭
5. 프로젝트가 생성될 때까지 대기 (몇 초 소요)

### 1.3 프로젝트 선택

- 상단의 프로젝트 선택 드롭다운에서 방금 생성한 프로젝트 선택

## 2단계: YouTube Data API v3 활성화

### 2.1 API 라이브러리로 이동

1. 왼쪽 메뉴에서 "API 및 서비스" > "라이브러리" 클릭
2. 검색창에 "YouTube Data API v3" 입력
3. "YouTube Data API v3" 선택

### 2.2 API 활성화

1. "사용 설정" 버튼 클릭
2. API가 활성화될 때까지 대기 (몇 초 소요)
3. 활성화 완료 메시지 확인

## 3단계: API 키 생성

### 3.1 사용자 인증 정보로 이동

1. 왼쪽 메뉴에서 "API 및 서비스" > "사용자 인증 정보" 클릭

### 3.2 API 키 만들기

1. 상단의 "+ 사용자 인증 정보 만들기" 클릭
2. "API 키" 선택
3. API 키가 생성되면 팝업에 표시됨
4. **API 키 복사** (나중에 다시 볼 수 없으므로 지금 복사!)

### 3.3 API 키 제한 설정 (권장)

보안을 위해 API 키에 제한을 설정하는 것을 강력히 권장합니다:

1. 생성된 API 키 옆의 연필 아이콘(편집) 클릭
2. **애플리케이션 제한사항** 설정:
   - "HTTP 리퍼러(웹사이트)" 선택
   - 다음 도메인 추가:
     ```
     http://localhost:*
     https://localhost:*
     https://*.github.io/*
     https://your-domain.com/*
     ```
3. **API 제한사항** 설정:
   - "키 제한" 선택
   - "YouTube Data API v3"만 선택
4. "저장" 클릭

## 4단계: 프로젝트에 API 키 설정

### 4.1 .env 파일 편집

프로젝트 루트의 `.env` 파일을 열고 API 키를 입력:

```bash
VITE_YOUTUBE_API_KEY=여기에_복사한_API_키_붙여넣기
```

예시:
```
VITE_YOUTUBE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.2 개발 서버 재시작

환경 변수를 변경했으므로 개발 서버를 재시작해야 합니다:

```bash
# 서버 중지 (Ctrl+C)
# 서버 재시작
npm run dev
```

## 5단계: API 사용 확인

### 5.1 테스트 검색

1. 브라우저에서 `http://localhost:5173` 접속
2. 검색어 입력 (예: "파이썬 튜토리얼")
3. "검색 및 분석" 버튼 클릭
4. 결과가 표시되면 성공!

### 5.2 오류 발생 시 확인사항

#### "API 키가 설정되지 않았습니다" 오류
- `.env` 파일에 `VITE_YOUTUBE_API_KEY`가 올바르게 설정되었는지 확인
- 환경 변수 이름이 `VITE_`로 시작하는지 확인
- 개발 서버를 재시작했는지 확인

#### "API 키가 유효하지 않습니다" 오류
- API 키가 올바르게 복사되었는지 확인
- YouTube Data API v3가 활성화되었는지 확인
- API 키 제한사항을 확인 (특히 HTTP 리퍼러 제한)

#### "할당량을 초과했습니다" 오류
- 일일 할당량(10,000 units)을 초과했을 수 있음
- 24시간 후 다시 시도하거나 할당량 증가 요청
- 자세한 내용은 [QUOTA_GUIDE.md](./QUOTA_GUIDE.md) 참조

## API 할당량 정보

### 기본 할당량
- **일일 할당량**: 10,000 units
- **검색 요청**: 100 units/요청
- **하루 약 100번의 검색** 가능

### 할당량 사용량 확인

1. Google Cloud Console 접속
2. "API 및 서비스" > "할당량" 메뉴
3. "YouTube Data API v3" 선택
4. 일일 사용량 확인

### 할당량 증가 요청

1. "API 및 서비스" > "할당량" 메뉴
2. "할당량 증가 요청" 클릭
3. 필요한 할당량과 사용 목적 설명
4. 요청 제출 (승인까지 며칠 소요될 수 있음)

## 프로젝트에서 API 사용 방법

### 현재 구현된 기능

프로젝트의 `src/services/api.js` 파일에서 YouTube API를 사용합니다:

```javascript
// YouTube 검색
export async function searchYouTubeVideos(query, maxResults, order) {
  const apiKey = getApiKey(); // .env에서 VITE_YOUTUBE_API_KEY 가져오기
  
  const url = 'https://www.googleapis.com/youtube/v3/search';
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: maxResults.toString(),
    order: order,
    key: apiKey
  });

  const response = await fetch(`${url}?${params}`);
  // ...
}
```

### API 엔드포인트

**검색 API**
```
GET https://www.googleapis.com/youtube/v3/search
```

**주요 파라미터:**
- `part`: 'snippet' (메타데이터 포함)
- `q`: 검색어
- `type`: 'video' (영상만 검색)
- `maxResults`: 최대 결과 수 (1-50)
- `order`: 정렬 기준 (relevance, date, rating, viewCount, title, videoCount)
- `key`: API 키

### 응답 형식

```json
{
  "items": [
    {
      "id": {
        "videoId": "dQw4w9WgXcQ"
      },
      "snippet": {
        "title": "영상 제목",
        "channelTitle": "채널 이름",
        "publishedAt": "2023-01-01T00:00:00Z",
        "description": "영상 설명",
        "thumbnails": {
          "high": {
            "url": "https://..."
          }
        }
      }
    }
  ]
}
```

## 보안 권장사항

### 1. API 키 제한 설정
- HTTP 리퍼러 제한 설정 (웹사이트 도메인만 허용)
- API 제한 설정 (YouTube Data API v3만 허용)

### 2. 환경 변수 관리
- `.env` 파일은 절대 Git에 커밋하지 않기
- `.gitignore`에 이미 포함되어 있음

### 3. 프로덕션 환경
- GitHub Pages 배포 시:
  - Google Cloud Console에서 GitHub Pages 도메인 허용
  - 예: `https://*.github.io/*`
- 백엔드 프록시 사용 (가장 안전):
  - API 키를 서버에서만 관리
  - 클라이언트는 서버 API를 통해 요청

## 추가 리소스

- [YouTube Data API v3 문서](https://developers.google.com/youtube/v3/docs)
- [API 참조](https://developers.google.com/youtube/v3/docs/search/list)
- [할당량 정보](https://developers.google.com/youtube/v3/getting-started#quota)
- [인증 가이드](https://developers.google.com/youtube/v3/guides/auth)

## 문제 해결

### API 키가 작동하지 않음

1. **API 키 확인**
   - Google Cloud Console > 사용자 인증 정보에서 확인
   - 올바르게 복사되었는지 확인

2. **API 활성화 확인**
   - "API 및 서비스" > "사용 설정된 API"에서 확인
   - "YouTube Data API v3"가 목록에 있는지 확인

3. **제한사항 확인**
   - HTTP 리퍼러 제한이 설정되어 있다면
   - 현재 도메인이 허용 목록에 있는지 확인

4. **환경 변수 확인**
   - `.env` 파일이 프로젝트 루트에 있는지 확인
   - 환경 변수 이름이 `VITE_YOUTUBE_API_KEY`인지 확인
   - 개발 서버를 재시작했는지 확인

### 할당량 초과

- 24시간 후 다시 시도
- 할당량 증가 요청
- 검색 결과 수 줄이기
- 자세한 내용은 [QUOTA_GUIDE.md](./QUOTA_GUIDE.md) 참조
