# YouTube API 403 할당량 초과 오류 해결 가이드

## 문제 상황

새로 발급받은 API 키로도 403 할당량 초과 오류가 발생하는 경우의 해결 방법입니다.

## 원인 분석

### 1. 프로젝트 레벨 할당량 제한
- **API 키가 아니라 프로젝트 단위로 할당량이 관리됩니다**
- 같은 프로젝트에서 여러 API 키를 발급해도 할당량은 공유됩니다
- 프로젝트의 일일 할당량(10,000 units)을 이미 사용했다면 새 API 키를 발급해도 동일한 오류 발생

### 2. 무료 티어 제한
- Google Cloud의 무료 티어는 기본 10,000 units/일로 제한됩니다
- 이 할당량은 프로젝트 전체에 적용됩니다

### 3. 할당량 리셋 시간
- 할당량은 매일 **태평양 표준시(PST) 자정**에 리셋됩니다
- 한국 시간으로는 **오후 5시(겨울) 또는 오후 6시(여름)**에 리셋됩니다

## 해결 방법

### 방법 1: 할당량 사용량 확인 및 대기 ⏰

1. **Google Cloud Console에서 할당량 확인**
   ```
   Google Cloud Console > API 및 서비스 > 할당량
   > YouTube Data API v3 선택
   ```

2. **사용량 확인**
   - 일일 사용량이 10,000 units에 도달했는지 확인
   - 할당량 리셋 시간까지 대기

3. **리셋 시간 확인**
   - 태평양 표준시 자정 = 한국 시간 오후 5시/6시
   - 다음 날까지 대기

### 방법 2: 새 프로젝트 생성 (가장 빠른 해결) 🆕

**새 프로젝트를 만들면 새로운 할당량(10,000 units)을 받을 수 있습니다.**

1. **새 프로젝트 생성**
   - Google Cloud Console 접속
   - 상단 프로젝트 선택 > "새 프로젝트"
   - 프로젝트 이름 입력 (예: `youtube-api-project-2`)
   - "만들기" 클릭

2. **YouTube Data API v3 활성화**
   - 새 프로젝트 선택
   - "API 및 서비스" > "라이브러리"
   - "YouTube Data API v3" 검색 및 활성화

3. **새 API 키 생성**
   - "API 및 서비스" > "사용자 인증 정보"
   - "API 키 만들기"
   - 새 API 키 복사

4. **.env 파일 업데이트**
   ```bash
   VITE_YOUTUBE_API_KEY=새로운_API_키
   ```

5. **개발 서버 재시작**
   ```bash
   npm run dev
   ```

### 방법 3: 할당량 증가 요청 📈

1. **할당량 증가 요청**
   - Google Cloud Console > API 및 서비스 > 할당량
   - "YouTube Data API v3" 선택
   - "할당량 증가 요청" 클릭

2. **요청 정보 입력**
   - 필요한 할당량: 예) 50,000 units/일
   - 사용 목적: 프로젝트 설명
   - 사용 사례: "YouTube 영상 검색 및 분석 도구 개발"

3. **승인 대기**
   - 보통 1-3일 소요
   - 승인되면 이메일 알림

### 방법 4: 여러 프로젝트 사용 (로테이션) 🔄

여러 프로젝트를 만들어서 API 키를 로테이션 사용:

1. **프로젝트 2-3개 생성**
   - 각 프로젝트마다 10,000 units 할당량
   - 총 20,000-30,000 units 사용 가능

2. **코드에서 키 로테이션 구현**
   ```javascript
   // .env 파일
   VITE_YOUTUBE_API_KEY_1=key1
   VITE_YOUTUBE_API_KEY_2=key2
   VITE_YOUTUBE_API_KEY_3=key3
   ```

   ```javascript
   // api.js 수정
   const getApiKey = () => {
     const keys = [
       import.meta.env.VITE_YOUTUBE_API_KEY_1,
       import.meta.env.VITE_YOUTUBE_API_KEY_2,
       import.meta.env.VITE_YOUTUBE_API_KEY_3,
     ].filter(Boolean);
     
     // 랜덤 또는 순차적으로 선택
     return keys[Math.floor(Math.random() * keys.length)];
   };
   ```

### 방법 5: API 사용 최적화 💡

#### 검색 결과 수 줄이기
- `maxResults`를 줄여서 할당량 절약
- 예: 10개 → 5개로 줄이면 할당량 절반 사용

#### 캐싱 구현
- 같은 검색어 결과를 localStorage에 캐싱
- 일정 시간(예: 1시간) 동안 캐시된 결과 사용

```javascript
// 캐싱 예시
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

export async function searchYouTubeVideos(query, maxResults, order) {
  const cacheKey = `youtube_search_${query}_${maxResults}_${order}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data; // 캐시된 데이터 반환
    }
  }
  
  // API 호출
  const data = await fetch(...);
  
  // 캐시 저장
  localStorage.setItem(cacheKey, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
  
  return data;
}
```

## 즉시 확인 사항

### 1. 할당량 사용량 확인

Google Cloud Console에서 확인:
1. "API 및 서비스" > "할당량" 메뉴
2. "YouTube Data API v3" 선택
3. 일일 사용량 확인
4. 사용량이 10,000 units에 도달했는지 확인

### 2. API 키 제한 설정 확인

API 키 편집에서 확인:
- HTTP 리퍼러 제한이 너무 엄격하지 않은지 확인
- 현재 도메인이 허용 목록에 있는지 확인

### 3. 프로젝트 확인

- 올바른 프로젝트가 선택되어 있는지 확인
- YouTube Data API v3가 활성화되어 있는지 확인

## 권장 해결 순서

1. ✅ **즉시**: 새 프로젝트 생성 및 새 API 키 발급 (가장 빠름)
2. ⏰ **단기**: 할당량 리셋 시간까지 대기 (24시간)
3. 📈 **중기**: 할당량 증가 요청 (1-3일)
4. 🔄 **장기**: 여러 프로젝트 로테이션 사용

## 예방 방법

### 개발 환경
- 개발 중에는 `maxResults`를 작게 설정 (3-5개)
- 테스트 후 즉시 할당량 확인

### 프로덕션 환경
- 캐싱 기능 구현
- 사용자에게 검색 제한 안내
- 여러 API 키 로테이션

## 할당량 계산

- **검색 요청**: 100 units
- **영상 상세 정보**: 1 unit
- **채널 정보**: 1 unit

**예시**:
- 검색 10개 영상: 100 units
- 하루 100번 검색: 10,000 units (할당량 소진)

## 추가 리소스

- [YouTube API 할당량 문서](https://developers.google.com/youtube/v3/getting-started#quota)
- [Google Cloud 할당량 관리](https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas)
- [할당량 증가 요청 가이드](https://support.google.com/cloud/answer/7039013)
