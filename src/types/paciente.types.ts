export interface Paciente {
  id: string
  cedula: string
  nombre: string
  apellido: string
  fechaNacimiento: string
  genero: 'masculino' | 'femenino' | 'otro'
  telefono: string
  email?: string
  alergias?: string[]
  estado: 'activo' | 'inactivo'
}

export interface CreatePacientePayload {
  cedula: string
  nombre: string
  apellido: string
  fechaNacimiento: string
  genero: 'masculino' | 'femenino' | 'otro'
  telefono: string
  email?: string
  alergias?: string[]
}
