import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// scroll bar
import 'simplebar/src/simplebar.css';

// third-party
import { Provider as ReduxProvider } from 'react-redux';

// apex-chart
import 'assets/third-party/apex-chart.css';

// project import

import { store } from 'store';
import reportWebVitals from './reportWebVitals';

import './index.css';
//Primereact styles
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
//Provider
import { PrimeReactProvider } from 'primereact/api';
import { AuthProvider } from 'context/authContext';
import App from 'App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        <ReduxProvider store={store}>
          <AuthProvider>
            <BrowserRouter basename="/pqrs">
              <App />
            </BrowserRouter>
          </AuthProvider>
        </ReduxProvider>
      </PrimeReactProvider>
    </QueryClientProvider>
  </StrictMode>
);
reportWebVitals();
