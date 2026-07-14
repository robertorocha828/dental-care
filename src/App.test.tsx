import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render home page by default', async () => {
    render(<App />);

    expect(
      screen.getByText('Sistema de gestión para consultorio odontológico'),
    ).toBeInTheDocument();

    expect(screen.getByText('Consultorio Odontologico')).toBeInTheDocument();
  });

  it('should navigate to welcome page', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Bienvenida'));

    expect(screen.getByText('Bienvenidos al sistema')).toBeInTheDocument();
    expect(screen.getByText('Pacientes')).toBeInTheDocument();
    expect(screen.getByText('Citas')).toBeInTheDocument();
  });

  it('should return to home page from welcome page', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Bienvenida'));
    fireEvent.click(screen.getByText('Volver al inicio'));

    expect(
      screen.getByText('Sistema de gestión para consultorio odontológico'),
    ).toBeInTheDocument();
  });
});