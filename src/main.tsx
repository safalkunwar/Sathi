import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});

const rootEl = document.getElementById('root');
if (rootEl) {
  rootEl.textContent = 'MOUNTING SATHI...';
}

console.log('[SATHI] main.tsx executing, root exists:', !!rootEl);

createRoot(rootEl!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

console.log('[SATHI] App rendered');
