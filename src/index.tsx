import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { Map } from './Map';
import './index.scss';
import { MapContextProvider } from './contexts/MapContext';
import { Sidebar } from './components/Sidebar/Sidebar';
import { AuthContext, AuthContextProvider } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm/LoginForm';

const UnderContexts = () => {
  const authContext = useContext(AuthContext);

  return (
    <div className="main">
      <Sidebar />
      <Map />
      {!authContext?.authToken && <LoginForm />}
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <MapContextProvider>
    <AuthContextProvider>
      <UnderContexts />
    </AuthContextProvider>
  </MapContextProvider>
);
