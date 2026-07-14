import { fireEvent, render, screen } from '@testing-library/react';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('should render navigation buttons', () => {
    render(<Navbar onNavigate={() => {}} />);

    expect(screen.getByText('Consultorio Odontologico')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Bienvenida')).toBeInTheDocument();
  });

  it('should call onNavigate when clicking Inicio', () => {
    const onNavigate = vi.fn();

    render(<Navbar onNavigate={onNavigate} />);

    fireEvent.click(screen.getByText('Inicio'));

    expect(onNavigate).toHaveBeenCalledWith('home');
  });

  it('should call onNavigate when clicking Bienvenida', () => {
    const onNavigate = vi.fn();

    render(<Navbar onNavigate={onNavigate} />);

    fireEvent.click(screen.getByText('Bienvenida'));

    expect(onNavigate).toHaveBeenCalledWith('welcome');
  });
});