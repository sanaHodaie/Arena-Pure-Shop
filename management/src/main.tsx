import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import AdminTooltips from './components/AdminTooltips.jsx';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <AdminTooltips />
  </StrictMode>,
);
