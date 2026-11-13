# Unira

**Las oportunidades existen. Encuentra las tuyas.**

Unira es una plataforma web gratuita, impulsada por inteligencia artificial, que ayuda a personas en México a **descubrir, entender y aprovechar** becas, apoyos, empleos, prácticas, cursos, concursos y programas de emprendimiento.

No necesitas saber qué buscar: Unira entiende tu situación, te muestra a qué puedes aplicar y te acompaña para preparar una postulación de calidad. **Tú revisas y tú envías.**

### 🌐 [Prueba Unira aquí → uniramx.base44.app](https://uniramx.base44.app/)

---

## 🎬 Video pitch

[▶️ Ver el video pitch de Unira](media/video-pitch.mp4)

---

## El problema

La desigualdad de oportunidades no depende solo de que existan programas. También hay una brecha de **información, acceso digital, orientación y tiempo**. Muchas personas:

- no se enteran de que una beca o convocatoria existe,
- no saben si cumplen los requisitos,
- o abandonan el trámite porque no saben preparar un CV, una carta de motivación o una solicitud.

## La solución

Unira funciona como un **orientador digital gratuito**:

1. **Cuéntanos sobre ti**: un quiz corto (3–5 min) para conocer tu situación, ubicación, etapa educativa o laboral e intereses.
2. **Descubre opciones**: recomendaciones de convocatorias verificadas con elegibilidad, fecha límite, costo, fuente y enlace oficial.
3. **Prepárate**: un agente de IA te ayuda a armar un CV a la medida de cada convocatoria, cartas de motivación y listas de requisitos.
4. **Postúlate**: das seguimiento a tus postulaciones, fechas importantes y próximos pasos.

Unira no sustituye la decisión de las instituciones ni garantiza la aceptación: mejora la preparación y el acceso.

## ¿Para quién es?

| Segmento | Qué encuentra en Unira |
| --- | --- |
| Familias con hijos en primaria | Becas y apoyos escolares filtrados por estado, tipo de escuela y requisitos |
| Adolescentes y jóvenes | Becas, orientación vocacional, concursos y cursos |
| Universitarios y recién egresados | Prácticas, intercambios, empleo inicial, becas y optimización de CV |
| Adultos en transición laboral | Vacantes, CV guiado, capacitación y preparación de entrevistas |
| Personas emprendedoras | Convocatorias, cursos, mentorías y apoyos de emprendimiento |

## Funciones principales

- **Motor de oportunidades**: convocatorias curadas, clasificadas y con fecha de verificación.
- **Recomendaciones explicables**: cada resultado muestra *por qué* te conviene (elegibilidad, intereses, ubicación y fecha).
- **CV inteligente**: CV limpio y compatible con ATS, adaptado a cada convocatoria sin inventar datos.
- **Asistente de solicitudes**: cartas de motivación y checklists de requisitos.
- **Mi guía**: acompañamiento paso a paso con IA durante la postulación.
- **Seguimiento**: panel de postulaciones, favoritos y fechas límite.
- **Accesibilidad**: lenguaje sencillo, diseño móvil primero y experiencia ligera.
- **Confianza**: fuentes oficiales, página de ayuda contra fraudes y política de privacidad clara.

## Impacto que buscamos

| Indicador | Qué mide |
| --- | --- |
| Descubrimiento | Usuarios que encuentran al menos una oportunidad pertinente |
| Calidad de matching | Porcentaje de resultados elegibles y útiles |
| Preparación | CV creados, cartas generadas y checklists completadas |
| Conversión | Postulaciones realizadas y aceptaciones reportadas |
| Equidad y acceso | Uso por segmento, dispositivo y región |

## Principios y salvaguardas

- **Información verificada**: cada ficha muestra fuente, fecha de consulta y vigencia.
- **Privacidad**: solo pedimos los datos indispensables y con consentimiento.
- **Sin promesas falsas**: la IA ayuda a prepararte, no asegura una beca ni un empleo.
- **Contra el fraude**: señalamos cobros sospechosos y nunca pedimos contraseñas.
- **No discriminación**: recomendaciones auditables y sin excluir por características protegidas.

## Modelo de sostenibilidad

- **Gratis para las personas** (B2C): búsqueda, orientación y herramientas esenciales siempre sin costo.
- **Alianzas** (B2B): universidades, fundaciones, empresas y gobierno pueden difundir convocatorias, sin vender datos personales ni alterar el orden de los resultados.

## Tecnología

- React 19 + [TanStack Start](https://tanstack.com/start) (rutas por archivos, SSR y funciones de servidor)
- Tailwind CSS + componentes UI
- Vite
- Agente de IA para recomendaciones, CV y cartas

### Estructura

```
src/
├── routes/            # Páginas: inicio, quiz, explorar, convocatoria, padres, fuentes, contacto…
│   └── _authed/       # Área personal: para ti, mi guía, mi currículum, postulaciones, perfil
├── components/unira/  # Componentes de la interfaz de Unira
└── lib/               # Lógica de convocatorias, postulaciones, IA y autenticación
```

### Correr localmente

```bash
npm ci
npm run dev
```

## Equipo

Proyecto desarrollado en México para reducir la brecha de oportunidades, presentado en un hackathon de impacto social (noviembre 2026).

> *Queremos que el acceso a las oportunidades no dependa de saber dónde buscar.*
