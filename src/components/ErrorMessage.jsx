import { useEffect } from 'react';
import './ErrorMessage.css';

function ErrorMessage({ message, onClose }) {
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  // 할당량 초과 오류인지 확인
  const isQuotaError = message.includes('할당량을 초과');
  const isAuthError = message.includes('API 키가 유효하지 않거나');

  return (
    <div className={`error ${isQuotaError ? 'error-quota' : ''} ${isAuthError ? 'error-auth' : ''}`}>
      <div className="error-content">
        {isQuotaError && (
          <div className="error-icon">⚠️</div>
        )}
        {isAuthError && (
          <div className="error-icon">🔑</div>
        )}
        <div className="error-message">
          {message.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>
      {onClose && (
        <button className="error-close" onClick={onClose}>×</button>
      )}
    </div>
  );
}

export default ErrorMessage;
