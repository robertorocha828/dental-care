import { jsPDF } from 'jspdf'
import type { Receta } from '@/types/receta.types'

const NAVY: [number, number, number] = [10, 37, 64]
const TEAL: [number, number, number] = [27, 138, 156]
const GRAY: [number, number, number] = [110, 110, 110]

interface DatosReceta {
  receta: Receta
  pacienteNombre: string
  pacienteCedula?: string
  odontologoNombre: string
  odontologoRegistro?: string
  odontologoEspecialidad?: string
}

export function generarRecetaPdf(datos: DatosReceta) {
  const { receta, pacienteNombre, pacienteCedula, odontologoNombre, odontologoRegistro, odontologoEspecialidad } = datos
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 20
  let y = 22

  doc.setFillColor(...NAVY)
  doc.rect(0, 0, pageWidth, 16, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('CONSULTORIO ODONTOLÓGICO', marginX, 10.5)

  y = 28
  doc.setTextColor(...TEAL)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Receta médica', marginX, y)

  y += 10
  doc.setDrawColor(...TEAL)
  doc.setLineWidth(0.4)
  doc.line(marginX, y, pageWidth - marginX, y)

  y += 8
  doc.setTextColor(...NAVY)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Paciente:', marginX, y)
  doc.setFont('helvetica', 'normal')
  doc.text(pacienteNombre + (pacienteCedula ? `  —  C.I. ${pacienteCedula}` : ''), marginX + 25, y)

  y += 7
  doc.setFont('helvetica', 'bold')
  doc.text('Fecha:', marginX, y)
  doc.setFont('helvetica', 'normal')
  doc.text(new Date(receta.fechaEmision).toLocaleDateString('es-EC'), marginX + 25, y)

  y += 7
  doc.setFont('helvetica', 'bold')
  doc.text('Odontólogo:', marginX, y)
  doc.setFont('helvetica', 'normal')
  doc.text(
    odontologoNombre + (odontologoEspecialidad ? ` — ${odontologoEspecialidad}` : ''),
    marginX + 25,
    y,
  )

  y += 12
  doc.setFillColor(...TEAL)
  doc.rect(marginX, y - 5, pageWidth - marginX * 2, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('MEDICAMENTO', marginX + 2, y)
  doc.text('DOSIS', marginX + 75, y)
  doc.text('INDICACIONES', marginX + 115, y)

  y += 8
  doc.setTextColor(...NAVY)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)

  receta.medicamentos.forEach((m, i) => {
    if (y > 260) {
      doc.addPage()
      y = 20
    }
    if (i % 2 === 0) {
      doc.setFillColor(245, 248, 249)
      doc.rect(marginX, y - 5, pageWidth - marginX * 2, 8, 'F')
    }
    doc.text(m.medicamento, marginX + 2, y, { maxWidth: 70 })
    doc.text(m.dosis, marginX + 75, y, { maxWidth: 38 })
    doc.text(m.indicaciones || '—', marginX + 115, y, { maxWidth: pageWidth - marginX - 117 })
    y += 8
  })

  if (receta.observaciones) {
    y += 6
    doc.setFont('helvetica', 'bold')
    doc.text('Observaciones:', marginX, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    const lineas = doc.splitTextToSize(receta.observaciones, pageWidth - marginX * 2)
    doc.text(lineas, marginX, y)
    y += lineas.length * 5
  }

  y = Math.max(y + 25, 250)
  doc.setDrawColor(...GRAY)
  doc.line(marginX + 40, y, pageWidth - marginX - 40, y)
  y += 5
  doc.setFontSize(10)
  doc.setTextColor(...NAVY)
  doc.text(odontologoNombre, pageWidth / 2, y, { align: 'center' })
  if (odontologoRegistro) {
    y += 5
    doc.setTextColor(...GRAY)
    doc.text(`Reg. No. ${odontologoRegistro}`, pageWidth / 2, y, { align: 'center' })
  }

  doc.setFontSize(8)
  doc.setTextColor(...GRAY)
  doc.text(
    `Generado el ${new Date().toLocaleString('es-EC')}`,
    marginX,
    doc.internal.pageSize.getHeight() - 10,
  )

  const nombreArchivo = `receta-${pacienteNombre.replace(/\s+/g, '_')}-${receta.fechaEmision.slice(0, 10)}.pdf`
  doc.save(nombreArchivo)
}