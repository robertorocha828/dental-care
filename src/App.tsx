import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import WelcomePage from './pages/WelcomePage';
import { obtenerEstadoBackend } from './services/api';
import type { BackendStatus, PageName } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<PageName>('home');
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);

  useEffect(() => {
    const cargarEstado = async () => {
      const data = await obtenerEstadoBackend();
      setBackendStatus(data);
    };

    cargarEstado();
  }, []);

  const renderPage = () => {
    if (currentPage === 'welcome') {
      return <WelcomePage onNavigate={setCurrentPage} />;
    }

    return <HomePage backendStatus={backendStatus} onNavigate={setCurrentPage} />;
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;