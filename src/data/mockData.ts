import type { BackendStatus, ModuleItem } from '../types';

export const backendMockStatus: BackendStatus = {
  status: 'Online',
  service: 'rocha-consultorio-odontologico api',
  version: '0.0.1',
};

export const modules: ModuleItem[] = [
  {
    title: 'Pacientes',
    description: 'Registro y seguimiento de información de los pacientes.',
    icon: '🧑‍⚕️',
  },
  {
    title: 'Citas',
    description: 'Gestión de agenda y atención odontológica.',
    icon: '📅',
  },
  {
    title: 'Tratamientos',
    description: 'Control de procedimientos, tipos de tratamiento y especialidades.',
    icon: '🦷',
  },
  {
    title: 'Inventario',
    description: 'Administración de insumos y materiales del consultorio.',
    icon: '📦',
  },
  {
    title: 'Recetas',
    description: 'Emisión y consulta de recetas médicas del paciente.',
    icon: '💊',
  },
  {
    title: 'Seguridad',
    description: 'Acceso al sistema mediante autenticación y control de usuarios.',
    icon: '🔐',
  },
];