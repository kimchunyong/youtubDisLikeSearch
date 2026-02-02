import { useState } from 'react';
import './SearchSection.css';

function SearchSection({ onSearch }) {
  const [query, setQuery] = useState('');
  const [maxResults, setMaxResults] = useState(30);
  const [order, setOrder] = useState('relevance');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, maxResults, order });
  };

  return (
    <div className="search-section">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="searchQuery">검색어:</label>
          <input
            type="text"
            id="searchQuery"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 파이썬 튜토리얼"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="maxResults">최대 결과 수:</label>
          <input
            type="number"
            id="maxResults"
            value={maxResults}
            onChange={(e) => setMaxResults(parseInt(e.target.value) || 30)}
            min="1"
            max="100"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="sortOrder">정렬 기준:</label>
          <select
            id="sortOrder"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="relevance">관련성</option>
            <option value="date">날짜</option>
            <option value="rating">평점</option>
            <option value="viewCount">조회수</option>
            <option value="title">제목</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">
          검색 및 분석
        </button>
      </form>
    </div>
  );
}

export default SearchSection;
