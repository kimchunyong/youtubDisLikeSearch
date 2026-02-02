import './Loading.css';

function Loading({ text }) {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}

export default Loading;
