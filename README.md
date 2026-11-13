# Unira

**Las oportunidades existen. Encuentra las tuyas.**

Unira es una plataforma gratuita, impulsada por inteligencia artificial, que ayuda a personas en México a descubrir, entender y aprovechar becas, empleos, prácticas, cursos, concursos y apoyos de emprendimiento. Funciona como un orientador digital: entiende tu situación, te muestra las convocatorias que realmente te aplican y te acompaña a preparar una postulación de calidad.

🎬 **[Ver el video pitch](docs/unira-pitch.mp4)**

---

## El problema

La desigualdad de oportunidades no se explica solo por la falta de programas. Existe una **brecha de información, de acceso digital, de orientación y de habilidades para postular**:

- Muchas personas nunca se enteran de que una beca o convocatoria existe.
- Quien la encuentra a veces no sabe si cumple los requisitos.
- Otros abandonan el trámite porque no saben preparar un CV, una carta de motivación o reunir los documentos.

En México, miles de personas pierden oportunidades no por falta de talento, sino porque no saben dónde buscar ni cómo solicitarlas.

## La solución

Unira centraliza oportunidades verificadas y ofrece acompañamiento personalizado de principio a fin:

1. **Cuéntanos sobre ti** — un quiz breve (o conversación) que solo pide la información indispensable.
2. **Descubre opciones** — recomendaciones explicables: por qué te aplica cada convocatoria, requisitos, fecha límite, costo y enlace oficial.
3. **Prepárate** — un agente de IA te ayuda a crear tu CV, redactar cartas de motivación y armar tu lista de requisitos, siempre a partir de tus datos reales y sin inventar información.
4. **Postúlate** — tú revisas y tú envías. Unira da seguimiento a cada postulación, sus etapas y fechas importantes.

> Unira mejora tu preparación, pero no sustituye la decisión de las instituciones ni garantiza la aceptación.

## ¿Para quién es?

| Segmento | Qué encuentra en Unira |
| --- | --- |
| Familias con hijos en primaria | Becas y apoyos escolares filtrados por estado, tipo de escuela y requisitos |
| Adolescentes y jóvenes | Becas, orientación vocacional, concursos y cursos |
| Universitarios y recién egresados | Prácticas, primer empleo, intercambios, becas y optimización de CV |
| Adultos en transición laboral | Vacantes, CV guiado, capacitación y preparación de entrevistas |
| Personas emprendedoras | Convocatorias, cursos, mentorías y apoyos |

## Funciones principales

- **Explorar convocatorias** con filtros por tipo, ubicación y fecha.
- **Recomendaciones "Para ti"** basadas en elegibilidad, intereses y ubicación, con razones visibles.
- **Mi currículum**: editor de CV guiado y exportación a PDF legible por sistemas ATS.
- **Carta de motivación asistida** con detección de afirmaciones sin respaldo.
- **Guía con IA** que explica requisitos y siguientes pasos de cada postulación.
- **Seguimiento de postulaciones** por etapas, con índice de preparación.
- **Alertas opcionales** cuando una convocatoria guardada abre, siempre con consentimiento.
- **Confianza y seguridad**: fuente oficial y fecha de verificación en cada ficha, reporte de datos incorrectos y una sección de ayuda contra fraudes.
- **Accesibilidad**: lenguaje sencillo y experiencia pensada para el celular.

## Principios

- **Fuentes oficiales**: cada oportunidad incluye URL de origen, vigencia y estado de verificación. La IA nunca inventa convocatorias.
- **Privacidad**: mínima recolección de datos, consentimiento explícito y la opción de borrar tu información en cualquier momento.
- **Equidad**: no se excluye a nadie por características protegidas salvo requisitos legítimos de cada programa.
- **Gratuito para las personas**: la búsqueda y la orientación esenciales siempre serán gratis.

## Tecnología

- [TanStack Start](https://tanstack.com/start) con React 19 (JavaScript), rutas por archivo y renderizado del lado del servidor.
- Tailwind CSS y componentes shadcn/ui.
- TanStack AI para el agente de orientación y la redacción asistida.
- Generación de PDF para el CV.

### Estructura

```
src/
  routes/            Páginas (explorar, quiz, convocatoria, padres, fuentes…)
  routes/_authed/    Área personal: inicio, para ti, postulaciones, mi currículum, guía, perfil
  components/unira/  Componentes de la interfaz de Unira
  lib/               Lógica de matching, postulaciones, CV e IA
```

### Desarrollo local

```bash
npm install
npm run dev     # servidor de desarrollo
npm run build   # build de producción
npm run lint
```

## Equipo

Proyecto creado en un hackathon de impacto social en México. Nuestro objetivo: que el acceso a las oportunidades no dependa de saber dónde buscar.
