
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const startApp = () => {
  const container = document.getElementById('root');
  const loader = document.getElementById('loading-screen');
  
  if (container) {
    try {
      const root = createRoot(container);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      
      if (loader) {
        setTimeout(() => {
          loader.style.opacity = '0';
          setTimeout(() => loader.style.display = 'none', 300);
        }, 500);
      }
    } catch (err) {
      console.error("Lỗi khởi tạo React:", err);
      throw err;
    }
  }
};

if (document.readyState === 'complete') {
  startApp();
} else {
  window.addEventListener('load', startApp);
}
