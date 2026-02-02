// API 설정
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
// 개발 시 Vite 프록시(/api/ryd) 사용 → CORS 없음, 프로덕션은 https://returnyoutubedislikeapi.com 로 직접 호출
const DISLIKE_API_BASE = import.meta.env.DEV
  ? 'https://returnyoutubedislikeapi.com'
  : 'https://returnyoutubedislikeapi.com';
const DISLIKE_API_PATH = import.meta.env.DEV ? '/votes' : '/api/votes';

// 환경 변수에서 API 키 가져오기
const getApiKey = () => {
  return import.meta.env.VITE_YOUTUBE_API_KEY || '';
};

// YouTube 검색
export async function searchYouTubeVideos(query, maxResults, order) {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('YouTube API 키가 설정되지 않았습니다. .env 파일에 VITE_YOUTUBE_API_KEY를 설정하세요.');
  }

  const url = `${YOUTUBE_API_BASE}/search`;
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: maxResults.toString(),
    order: order,
    key: apiKey
  });

  const response = await fetch(`${url}?${params}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    const error = errorData.error || {};
    
    // 할당량 초과 오류 처리
    if (error.reason === 'quotaExceeded' || (error.code === 403 && error.message?.includes('quota'))) {
      throw new Error(
        'YouTube API 일일 할당량을 초과했습니다.\n\n' +
        '⚠️ 중요: API 키가 아니라 프로젝트 단위로 할당량이 관리됩니다.\n' +
        '같은 프로젝트에서 새 API 키를 발급해도 할당량은 공유됩니다.\n\n' +
        '즉시 해결 방법:\n' +
        '1. 새 프로젝트를 생성하고 새 API 키를 발급하세요 (가장 빠름)\n' +
        '2. 할당량 리셋 시간까지 대기 (한국 시간 오후 5-6시)\n\n' +
        '기타 해결 방법:\n' +
        '3. Google Cloud Console에서 할당량 증가를 요청하세요\n' +
        '4. 검색 결과 수를 줄여서 시도하세요\n' +
        '5. 여러 프로젝트를 만들어서 API 키를 로테이션 사용하세요\n\n' +
        '자세한 내용은 TROUBLESHOOTING.md 파일을 참조하세요.'
      );
    }
    
    // 인증 오류 처리
    if (error.code === 400 || error.code === 401) {
      throw new Error(
        'YouTube API 키가 유효하지 않거나 권한이 없습니다.\n\n' +
        '확인 사항:\n' +
        '1. .env 파일에 VITE_YOUTUBE_API_KEY가 올바르게 설정되었는지 확인\n' +
        '2. YouTube Data API v3가 활성화되었는지 확인\n' +
        '3. API 키의 제한사항을 확인하세요'
      );
    }
    
    throw new Error(error.message || 'YouTube API 요청 실패');
  }

  const data = await response.json();
  
  return data.items.map(item => ({
    video_id: item.id.videoId,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    published_at: item.snippet.publishedAt,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url
  }));
}

// Return YouTube Dislike API로 좋아요/싫어요 데이터 조회
export async function getVideoRatings(videoId) {
  try {
    const url = `${DISLIKE_API_BASE}${DISLIKE_API_PATH}`;
    const params = new URLSearchParams({ videoId });
    
    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      video_id: data.id || videoId,
      likes: data.likes || 0,
      dislikes: data.dislikes || 0,
      rating: data.rating || 0.0,
      view_count: data.viewCount || 0,
      date_created: data.dateCreated || ''
    };
  } catch (err) {
    console.warn(`영상 ${videoId}의 데이터를 가져오는 중 오류:`, err);
    return null;
  }
}

// 여러 영상의 데이터 일괄 조회
export async function getMultipleVideoRatings(videoIds, progressCallback, delay = 500) {
  const results = {};
  
  for (let i = 0; i < videoIds.length; i++) {
    const videoId = videoIds[i];
    
    if (progressCallback) {
      progressCallback(i + 1, videoIds.length);
    }
    
    const rating = await getVideoRatings(videoId);
    if (rating) {
      results[videoId] = rating;
    }
    
    // API 제한 방지를 위한 지연
    if (i < videoIds.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return results;
}
