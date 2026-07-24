export function esCedulaEcuatorianaValida(cedula: string): boolean {
  if (!/^\d{10}$/.test(cedula)) return false

  const provincia = parseInt(cedula.substring(0, 2), 10)
  if (provincia < 1 || provincia > 24) return false

  const tercerDigito = parseInt(cedula[2], 10)
  if (tercerDigito > 6) return false

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
  let suma = 0
  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula[i], 10) * coeficientes[i]
    if (valor >= 10) valor -= 9
    suma += valor
  }
  const digitoVerificador = (10 - (suma % 10)) % 10
  return digitoVerificador === parseInt(cedula[9], 10)
}

export function esCelularEcuatorianoValido(telefono: string): boolean {
  return /^0\d{9}$/.test(telefono)
}

export function esFechaNacimientoValida(fecha: string): boolean {
  if (!fecha) return false
  const hoy = new Date()
  const nacimiento = new Date(fecha)
  if (nacimiento.getTime() > hoy.getTime()) return false
  const edadMaxima = new Date()
  edadMaxima.setFullYear(hoy.getFullYear() - 120)
  return nacimiento.getTime() >= edadMaxima.getTime()
}