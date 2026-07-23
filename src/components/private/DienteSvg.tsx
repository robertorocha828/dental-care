import type { Superficies, EstadoSuperficie } from '@/types/odontograma.types'

export const COLOR_ESTADO: Record<EstadoSuperficie, string> = {
  sano: '#ffffff',
  caries: '#dc3545',
  obturado: '#0d6efd',
  fractura: '#fd7e14',
  ausente: '#495057',
}

interface DienteSvgProps {
  numero: number
  superficies: Superficies
  onSurfaceClick: (numero: number, superficie: keyof Superficies) => void
  size?: number
}

// Mismas 5 superficies y coordenadas exactas de diente.svg: vestibular (arriba),
// distal e mesial (lados), lingual (abajo), oclusal (centro).
export default function DienteSvg({ numero, superficies, onSurfaceClick, size = 56 }: DienteSvgProps) {
  const surfaces: { id: keyof Superficies; points: string }[] = [
    { id: 'vestibular', points: '0 0 100 0 80 20 20 20' },
    { id: 'distal', points: '0 0 20 20 20 80 0 100' },
    { id: 'lingual', points: '20 80 80 80 100 100 0 100' },
    { id: 'mesial', points: '100 0 100 100 80 80 80 20' },
    { id: 'oclusal', points: '20 20 80 20 80 80 20 80' },
  ]

  return (
    <div className="text-center" style={{ width: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#6c757d" strokeWidth={1.5}>
          {surfaces.map((s) => (
            <polygon
              key={s.id}
              points={s.points}
              fill={COLOR_ESTADO[superficies[s.id]]}
              onClick={() => onSurfaceClick(numero, s.id)}
              style={{ cursor: 'pointer' }}
            >
              <title>{`${s.id} — ${superficies[s.id]}`}</title>
            </polygon>
          ))}
        </g>
      </svg>
      <div className="small fw-semibold text-muted">{numero}</div>
    </div>
  )
}