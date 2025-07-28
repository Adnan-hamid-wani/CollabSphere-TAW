import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {DarkModeProvider} from '@adnanwani/universal-darkmode'

createRoot(document.getElementById('root')!).render(
      <DarkModeProvider>

  <StrictMode>
          <App />

  </StrictMode>
        </DarkModeProvider>

);
