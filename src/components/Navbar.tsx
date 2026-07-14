import type { PageName } from '../types';

interface NavbarProps {
  onNavigate: (page: PageName) => void;
}

function Navbar({ onNavigate }: NavbarProps) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        <button
          type="button"
          className="navbar-brand btn btn-link text-white text-decoration-none fw-bold p-0"
          onClick={() => onNavigate('home')}
        >
          Consultorio Odontologico
        </button>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={() => onNavigate('home')}
          >
            Inicio
          </button>

          <button
            type="button"
            className="btn btn-light btn-sm"
            onClick={() => onNavigate('welcome')}
          >
            Bienvenida
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;