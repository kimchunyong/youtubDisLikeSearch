# YouTube API 할당량 초과 오류 해결 가이드

## 오류 메시지

```
{
  "error": {
    "code": 403,
    "message": "The request cannot be completed because you have exceeded your quota",
    "reason": "quotaExceeded"
  }
}
```

## 원인

YouTube Data API v3는 일일 할당량(quota)이 있습니다:
- **기본 할당량**: 10,000 units/일
- **검색 요청**: 100 units/요청
- 즉, 하루에 약 **100번의 검색**만 가능합니다

## 해결 방법

### 1. 즉시 해결 (24시간 대기)

가장 간단한 방법은 **24시간을 기다리는 것**입니다. 할당량은 매일 자정(태평양 표준시 기준)에 리셋됩니다.

### 2. 할당량 증가 요청

Google Cloud Console에서 할당량 증가를 요청할 수 있습니다:

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택
3. "API 및 서비스" > "할당량" 메뉴로 이동
4. "YouTube Data API v3" 선택
5. "할당량 증가 요청" 클릭
6. 필요한 할당량과 사용 목적을 설명하여 요청

⚠️ **주의**: 할당량 증가 요청은 승인이 필요하며, 보통 몇 일이 걸릴 수 있습니다.

### 3. 여러 API 키 사용 (로테이션)

여러 Google 계정으로 API 키를 발급받아 사용할 수 있습니다:

```javascript
// .env 파일에 여러 API 키 추가
VITE_YOUTUBE_API_KEY_1=key1
VITE_YOUTUBE_API_KEY_2=key2
VITE_YOUTUBE_API_KEY_3=key3
```

코드에서 키를 로테이션하여 사용하도록 수정할 수 있습니다.

### 4. API 사용 최적화

#### 검색 결과 수 줄이기
- `maxResults`를 줄여서 요청 수 감소
- 예: 10개 → 5개로 줄이면 할당량 절반 사용

#### 캐싱 구현
- 같은 검색어에 대한 결과를 localStorage에 캐싱
- 일정 시간(예: 1시간) 동안 캐시된 결과 사용

#### 요청 빈도 줄이기
- 사용자에게 검색 간격을 두도록 안내
- 자동 새로고침 기능 제거

### 5. 다른 API 사용 고려

#### YouTube Data API v3 대안
- **YouTube IFrame Player API**: 제한이 덜함
- **YouTube Embed API**: 공개 영상 정보만 필요시

#### Return YouTube Dislike API
- 이 API는 할당량 제한이 없거나 매우 큽니다
- 좋아요/싫어요 데이터는 이 API만으로도 충분할 수 있습니다

## 코드 개선 사항

프로젝트에 다음 개선이 적용되었습니다:

1. **에러 메시지 개선**: 할당량 초과 시 명확한 안내 메시지 표시
2. **에러 타입별 스타일링**: 할당량 오류와 인증 오류를 시각적으로 구분
3. **사용자 안내**: 해결 방법을 에러 메시지에 포함

## 예방 방법

### 개발 환경
- 개발 중에는 `maxResults`를 작게 설정 (예: 3-5개)
- 테스트 후 즉시 할당량 확인

### 프로덕션 환경
- 사용자에게 검색 제한 안내
- 캐싱 기능 구현
- 할당량 모니터링 설정

### 모니터링
Google Cloud Console에서 할당량 사용량을 모니터링하세요:
1. "API 및 서비스" > "할당량" 메뉴
2. "YouTube Data API v3" 선택
3. 일일 사용량 확인

## 할당량 계산

- **검색 요청**: 100 units
- **영상 상세 정보**: 1 unit
- **채널 정보**: 1 unit

**예시**:
- 검색 10개 영상: 100 units
- 영상 상세 정보 10개: 10 units
- **총 110 units**

하루 10,000 units로는 약 **90번의 검색**이 가능합니다.

## 추가 리소스

- [YouTube API 할당량 문서](https://developers.google.com/youtube/v3/getting-started#quota)
- [Google Cloud Console 할당량 관리](https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas)
- [할당량 증가 요청 가이드](https://support.google.com/cloud/answer/7039013)
