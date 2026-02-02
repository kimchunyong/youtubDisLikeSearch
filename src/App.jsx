import { useState, useEffect } from 'react';
import SearchSection from './components/SearchSection';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import Summary from './components/Summary';
import Charts from './components/Charts';
import VideoList from './components/VideoList';
import Footer from './components/Footer';
import AdSense from './components/AdSense';
import { searchYouTubeVideos, getMultipleVideoRatings } from './services/api';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('검색 중...');
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleSearch = async (searchParams) => {
    const { query, maxResults, order } = searchParams;
    
    if (!query.trim()) {
      setError('검색어를 입력하세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      // 1단계: YouTube 검색
      setLoadingText('YouTube에서 영상 검색 중...');
      const videos = await searchYouTubeVideos(query, maxResults, order);

      if (videos.length === 0) {
        throw new Error('검색 결과가 없습니다.');
      }

      // 2단계: 좋아요/싫어요 데이터 수집
      setLoadingText('좋아요/싫어요 데이터 수집 중...');
      const videoIds = videos.map(v => v.video_id);
      const ratings = await getMultipleVideoRatings(videoIds, (current, total) => {
        setLoadingText(`좋아요/싫어요 데이터 수집 중... (${current}/${total})`);
      });

      // 3단계: 데이터 통합
      setLoadingText('데이터 통합 중...');
      const combinedData = videos.map(video => {
        const rating = ratings[video.video_id];
        if (!rating) return null;

        const total = rating.likes + rating.dislikes;
        const ratio = total > 0 ? rating.likes / total : 0;

        return {
          ...video,
          ...rating,
          ratio: ratio
        };
      }).filter(item => item !== null);

      if (combinedData.length === 0) {
        throw new Error('수집된 데이터가 없습니다.');
      }

      setData(combinedData);
    } catch (err) {
      console.error('오류 발생:', err);
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>🎬 YouTube 영상 좋아요/싫어요 비율 분석</h1>
          <p className="subtitle">검색어로 관련 영상들을 찾아 반응 비율을 시각화합니다</p>
        </header>

        <SearchSection onSearch={handleSearch} />

        <AdSense />

        {loading && <Loading text={loadingText} />}
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        {data && (
          <>
            <Summary data={data} />
            <Charts data={data} />
            <VideoList data={data} />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;
