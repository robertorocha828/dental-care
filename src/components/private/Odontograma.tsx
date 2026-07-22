import { Row, Col, Card } from 'react-bootstrap'
import DienteSvg, { COLOR_ESTADO } from './DienteSvg'
import type { Diente, Superficies, EstadoSuperficie } from '@/types/odontograma.types'

// Orden de ciclo al hacer clic en una superficie
export const CICLO_ESTADOS: EstadoSuperficie[] = ['sano', 'caries', 'obturado', 'fractura', 'ausente']

const SUPERFICIES_DEFECTO: Superficies = {
  vestibular: 'sano',
  distal: 'sano',
  lingual: 'sano',
  mesial: 'sano',
  oclusal: 'sano',
}

// Numeración FDI/ISO 3950
const PERMANENTES = {
  superiorDerecho: [18, 17, 16, 15, 14, 13, 12, 11],
  superiorIzquierdo: [21, 22, 23, 24, 25, 26, 27, 28],
  inferiorIzquierdo: [31, 32, 33, 34, 35, 36, 37, 38],
  inferiorDerecho: [41, 42, 43, 44, 45, 46, 47, 48],
}

const TEMPORALES = {
  superiorDerecho: [55, 54, 53, 52, 51],
  superiorIzquierdo: [61, 62, 63, 64, 65],
  inferiorIzquierdo: [71, 72, 73, 74, 75],
  inferiorDerecho: [81, 82, 83, 84, 85],
}

const LEYENDA: { estado: EstadoSuperficie; label: string }[] = [
  { estado: 'sano', label: 'Sano' },
  { estado: 'caries', label: 'Caries' },
  { estado: 'obturado', label: 'Obturado' },
  { estado: 'fractura', label: 'Fractura' },
  { estado: 'ausente', label: 'Ausente' },
]

interface OdontogramaProps {
  dientes: Diente[]
  onSurfaceClick: (numero: number, superficie: keyof Superficies) => void
}

export default function Odontograma({ dientes, onSurfaceClick }: OdontogramaProps) {
  const getSuperficies = (numero: number): Superficies =>
    dientes.find((d) => d.numero === numero)?.superficies ?? SUPERFICIES_DEFECTO

  const renderFila = (numeros: number[]) => (
    <div className="d-flex gap-2 justify-content-center flex-wrap">
      {numeros.map((n) => (
        <DienteSvg key={n} numero={n} superficies={getSuperficies(n)} onSurfaceClick={onSurfaceClick} />
      ))}
    </div>
  )

  return (
    <div>
      {/* Leyenda */}
      <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center">
        {LEYENDA.map((item) => (
          <div key={item.estado} className="d-flex align-items-center gap-2 small">
            <span
              style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                backgroundColor: COLOR_ESTADO[item.estado],
                border: '1px solid #6c757d',
                borderRadius: 3,
              }}
            />
            {item.label}
          </div>
        ))}
      </div>

      {/* Dentición permanente */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <Card.Title className="fw-bold small text-uppercase text-muted mb-3">
            Dentición permanente
          </Card.Title>
          <Row className="g-3">
            <Col xs={6}>{renderFila(PERMANENTES.superiorDerecho)}</Col>
            <Col xs={6}>{renderFila(PERMANENTES.superiorIzquierdo)}</Col>
          </Row>
          <hr />
          <Row className="g-3">
            <Col xs={6}>{renderFila(PERMANENTES.inferiorIzquierdo)}</Col>
            <Col xs={6}>{renderFila(PERMANENTES.inferiorDerecho)}</Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Dentición temporal */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <Card.Title className="fw-bold small text-uppercase text-muted mb-3">
            Dentición temporal (niños)
          </Card.Title>
          <Row className="g-3">
            <Col xs={6}>{renderFila(TEMPORALES.superiorDerecho)}</Col>
            <Col xs={6}>{renderFila(TEMPORALES.superiorIzquierdo)}</Col>
          </Row>
          <hr />
          <Row className="g-3">
            <Col xs={6}>{renderFila(TEMPORALES.inferiorIzquierdo)}</Col>
            <Col xs={6}>{renderFila(TEMPORALES.inferiorDerecho)}</Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  )
}