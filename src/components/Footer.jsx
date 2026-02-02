import './Footer.css';

function Footer() {
  return (
    <footer>
      <p>YouTube Data API v3 & Return YouTube Dislike API를 사용합니다</p>
      <p>
        <a href="https://returnyoutubedislike.com/docs" target="_blank" rel="noopener noreferrer">
          Return YouTube Dislike API 문서
        </a>
        {' | '}
        <a href="https://developers.google.com/youtube/v3/docs" target="_blank" rel="noopener noreferrer">
          YouTube API 문서
        </a>
      </p>
    </footer>
  );
}

export default Footer;
