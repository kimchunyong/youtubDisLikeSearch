import { useEffect, useRef } from 'react';
import './AdSense.css';

// index.html 스니펫과 동일한 client. env로 덮어쓸 수 있음.
const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-9163702166115880';
const ADSENSE_SLOT = import.meta.env.VITE_ADSENSE_SLOT || '';

function loadAdSenseScript(clientId) {
  if (!clientId || document.querySelector('script[src*="adsbygoogle"]')) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

function AdSense({ slot = ADSENSE_SLOT, format = 'auto', className = '' }) {
  const insRef = useRef(null);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot) return;
    loadAdSenseScript(ADSENSE_CLIENT).then(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn('AdSense push error:', e);
      }
    });
  }, [slot]);

  if (!ADSENSE_CLIENT || !slot) return null;

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default AdSense;
