export interface ServicioInfo {
  slug: string
  titulo: string
  descripcionCorta: string
  descripcionLarga: string
  imagen: string
}

export const SERVICIOS: ServicioInfo[] = [
  {
    slug: 'ortodoncia',
    titulo: 'Ortodoncia',
    descripcionCorta: 'Corrección de la posición dental y de mordida.',
    descripcionLarga:
      'La ortodoncia corrige la posición de los dientes y la mordida mediante brackets, alineadores u otros aparatos. Mejora la función masticatoria, facilita la higiene diaria y previene el desgaste irregular de las piezas dentales a largo plazo. El tratamiento se adapta según la edad y la complejidad del caso, con controles periódicos para ajustar el avance.',
    imagen: '/ortodoncia.png',
  },
  {
    slug: 'endodoncia',
    titulo: 'Endodoncia',
    descripcionCorta: 'Tratamiento de conducto y salud interna del diente.',
    descripcionLarga:
      'La endodoncia trata el interior del diente (pulpa y conductos radiculares) cuando hay infección, caries profunda o daño irreversible. El objetivo es eliminar el tejido afectado y sellar el conducto para conservar la pieza dental original en vez de extraerla, evitando así el uso de prótesis o implantes.',
    imagen: '/endodoncia.png',
  },
  {
    slug: 'periodoncia',
    titulo: 'Periodoncia',
    descripcionCorta: 'Cuidado de encías y tejido de soporte dental.',
    descripcionLarga:
      'La periodoncia se encarga de la salud de las encías y el tejido que sostiene los dientes. Trata afecciones como gingivitis y periodontitis mediante limpiezas profundas y control de placa bacteriana, previniendo la pérdida de piezas dentales por debilitamiento del soporte óseo y gingival.',
    imagen: '/periodoncia.png',
  },
  {
    slug: 'odontopediatria',
    titulo: 'Odontopediatría',
    descripcionCorta: 'Atención dental especializada para niños.',
    descripcionLarga:
      'La odontopediatría ofrece atención dental adaptada a niños y niñas, en un ambiente cómodo y de confianza. Incluye chequeos preventivos, sellantes, tratamiento de caries en dientes de leche y educación temprana en hábitos de higiene bucal para sentar las bases de una sonrisa sana a futuro.',
    imagen: '/odontopediatria.png',
  },
  {
    slug: 'estetica-dental',
    titulo: 'Estética Dental',
    descripcionCorta: 'Blanqueamiento y diseño de sonrisa.',
    descripcionLarga:
      'La estética dental mejora la apariencia de la sonrisa mediante blanqueamiento, carillas y diseño de sonrisa personalizado. Cada tratamiento se planifica según la forma facial y las proporciones dentales de cada paciente, buscando un resultado natural y armonioso.',
    imagen: '/estetica-dental.png',
  },
  {
    slug: 'chequeo-general',
    titulo: 'Chequeo General',
    descripcionCorta: 'Diagnóstico y prevención integral.',
    descripcionLarga:
      'El chequeo general es la base de la prevención: una evaluación completa de dientes, encías y mordida para detectar a tiempo caries, desgaste o cualquier otra alteración. Se recomienda al menos dos veces al año, incluso sin síntomas visibles.',
    imagen: '/chequeo-general.png',
  },
]

export function getServicioPorSlug(slug: string) {
  return SERVICIOS.find((s) => s.slug === slug) ?? null
}