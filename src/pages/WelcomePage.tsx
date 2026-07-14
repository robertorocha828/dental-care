import ModuleCard from '../components/ModuleCard';
import { modules } from '../data/mockData';
import type { PageName } from '../types';

interface WelcomePageProps {
  onNavigate: (page: PageName) => void;
}

function WelcomePage({ onNavigate }: WelcomePageProps) {
  return (
    <main className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary">Bienvenidos al sistema</h1>
        <p className="lead text-secondary">
          Plataforma académica orientada a la gestión clínica y administrativa
          del consultorio odontológico.
        </p>
      </div>

      <div className="row g-4">
        {modules.map((module) => (
          <ModuleCard
            key={module.title}
            title={module.title}
            description={module.description}
            icon={module.icon}
          />
        ))}
      </div>

      <div className="text-center mt-5">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => onNavigate('home')}
        >
          Volver al inicio
        </button>
      </div>

      <footer className="footer-custom text-center py-3 mt-5 text-muted">
        Módulos principales del sistema odontológico
      </footer>
    </main>
  );
}

export default WelcomePage;