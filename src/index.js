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
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
//css
import './index.css';
//Datables

//Provider
import { AuthProvider } from 'context/authContext';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import ProtectedRoute from 'ProtectedRoutes';
import App from 'App';

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <StrictMode>
    <ReduxProvider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <App />
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="radicados" element="" />
              <Route path="pqrs" element="" />
              <Route path="admin" element="" />
              <Route path="usuariosqx" element="" />
              <Route path="dashboard/default" element="" />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ReduxProvider>
  </StrictMode>
);
reportWebVitals();
