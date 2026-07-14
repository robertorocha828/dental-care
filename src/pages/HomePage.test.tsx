import { fireEvent, render, screen } from '@testing-library/react';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('should render main content', () => {
    render(
      <HomePage
        backendStatus={{
          status: 'Online',
          service: 'rocha-consultorio-odontologico api',
          version: '0.0.1',
        }}
        onNavigate={() => {}}
      />,
    );

    expect(
      screen.getByText('Sistema de gestión para consultorio odontológico'),
    ).toBeInTheDocument();

    expect(screen.getByText('Estado del sistema')).toBeInTheDocument();
    expect(screen.getByText('Sistema listo')).toBeInTheDocument();
  });

  it('should show loading message when backendStatus is null', () => {
    render(<HomePage backendStatus={null} onNavigate={() => {}} />);

    expect(
      screen.getByText('Cargando información del sistema...'),
    ).toBeInTheDocument();
  });

  it('should call onNavigate when clicking Ir a bienvenida', () => {
    const onNavigate = vi.fn();

    render(
      <HomePage
        backendStatus={{
          status: 'Online',
          service: 'rocha-consultorio-odontologico api',
          version: '0.0.1',
        }}
        onNavigate={onNavigate}
      />,
    );

    fireEvent.click(screen.getByText('Ir a bienvenida'));

    expect(onNavigate).toHaveBeenCalledWith('welcome');
  });
});