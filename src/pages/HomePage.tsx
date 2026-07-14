import type { BackendStatus, PageName } from '../types';

interface HomePageProps {
  backendStatus: BackendStatus | null;
  onNavigate: (page: PageName) => void;
}

function HomePage({ backendStatus, onNavigate }: HomePageProps) {
  return (
    <main className="container py-5">
      <div className="row align-items-center min-vh-75">
        <div className="col-lg-6 mb-4">
          <span className="badge bg-primary mb-3">Frontend React + Bootstrap</span>

          <h1 className="display-5 fw-bold hero-title">
            Sistema de gestión para consultorio odontológico
          </h1>

          <p className="lead hero-text">
            Interfaz inicial del proyecto desarrollada con React y Bootstrap
            para la administración clínica y operativa del consultorio.
          </p>

          <div className="d-flex flex-wrap gap-3 mt-4">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('welcome')}
            >
              Ir a bienvenida
            </button>

            <button
              type="button"
              className="btn btn-outline-primary btn-lg"
              onClick={() => onNavigate('welcome')}
            >
              Ver módulos
            </button>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h2 className="h4 text-primary mb-3">Estado del sistema</h2>

              {backendStatus ? (
                <div className="alert alert-success mb-0">
                  <strong>Sistema listo</strong>
                  <br />
                  Estado: {backendStatus.status}
                  <br />
                  Servicio: {backendStatus.service}
                  <br />
                  Versión: {backendStatus.version}
                </div>
              ) : (
                <div className="alert alert-secondary mb-0">
                  Cargando información del sistema...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="footer-custom text-center py-3 mt-4 text-muted">
        Consultorio Odontologico - Proyecto académico
      </footer>
    </main>
  );
}

export default HomePage;