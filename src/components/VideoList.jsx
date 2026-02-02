import './VideoList.css';

function VideoList({ data }) {
  const sortedData = [...data].sort((a, b) => b.ratio - a.ratio);

  return (
    <div className="video-list">
      <h2>📺 영상 목록</h2>
      <div className="video-list-content">
        {sortedData.map((video) => (
          <div key={video.video_id} className="video-item">
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="video-thumbnail"
            />
            <div className="video-info">
              <div className="video-title">{video.title}</div>
              <div className="video-channel">{video.channel}</div>
              <div className="video-stats">
                <div className="stat-item">
                  <span className="label">좋아요:</span>
                  <span className="value">{video.likes.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="label">싫어요:</span>
                  <span className="value">{video.dislikes.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="label">좋아요 비율:</span>
                  <span className="value">{(video.ratio * 100).toFixed(2)}%</span>
                </div>
                <div className="stat-item">
                  <span className="label">조회수:</span>
                  <span className="value">{video.view_count.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoList;
