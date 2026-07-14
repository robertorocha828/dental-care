import { fireEvent, render, screen } from '@testing-library/react';
import WelcomePage from './WelcomePage';

describe('WelcomePage', () => {
  it('should render welcome content', () => {
    render(<WelcomePage onNavigate={() => {}} />);

    expect(screen.getByText('Bienvenidos al sistema')).toBeInTheDocument();
    expect(screen.getByText('Pacientes')).toBeInTheDocument();
    expect(screen.getByText('Citas')).toBeInTheDocument();
    expect(screen.getByText('Tratamientos')).toBeInTheDocument();
    expect(screen.getByText('Inventario')).toBeInTheDocument();
  });

  it('should call onNavigate when clicking Volver al inicio', () => {
    const onNavigate = vi.fn();

    render(<WelcomePage onNavigate={onNavigate} />);

    fireEvent.click(screen.getByText('Volver al inicio'));

    expect(onNavigate).toHaveBeenCalledWith('home');
  });
});