import { render, screen } from '@testing-library/react';
import ModuleCard from './ModuleCard';

describe('ModuleCard', () => {
  it('should render title, description and icon', () => {
    render(
      <ModuleCard
        title="Pacientes"
        description="Registro y seguimiento de información de los pacientes."
        icon="🧑‍⚕️"
      />,
    );

    expect(screen.getByText('Pacientes')).toBeInTheDocument();
    expect(
      screen.getByText('Registro y seguimiento de información de los pacientes.'),
    ).toBeInTheDocument();
    expect(screen.getByText('🧑‍⚕️')).toBeInTheDocument();
  });
});