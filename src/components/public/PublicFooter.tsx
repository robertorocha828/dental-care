import { Container, Row, Col } from 'react-bootstrap'

export default function PublicFooter() {
  return (
    <footer className="py-4 bg-dark text-white border-top border-secondary">
      <Container>
        <Row className="align-items-center g-2">
          <Col xs={12} md="auto">
            <span className="fw-bold">Consultorio Odontológico</span>
          </Col>
          <Col className="text-md-center text-muted small">
            © {new Date().getFullYear()} — Sistema de gestión odontológica
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
