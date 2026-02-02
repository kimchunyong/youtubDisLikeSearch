import './Summary.css';

function Summary({ data }) {
  const totalVideos = data.length;
  const totalLikes = data.reduce((sum, d) => sum + d.likes, 0);
  const totalDislikes = data.reduce((sum, d) => sum + d.dislikes, 0);
  const avgRatio = data.reduce((sum, d) => sum + d.ratio, 0) / totalVideos;

  return (
    <div className="summary">
      <h2>📊 데이터 요약</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">총 영상 수</div>
          <div className="stat-value">{totalVideos.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">총 좋아요 수</div>
          <div className="stat-value">{totalLikes.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">총 싫어요 수</div>
          <div className="stat-value">{totalDislikes.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">평균 좋아요 비율</div>
          <div className="stat-value">{(avgRatio * 100).toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
