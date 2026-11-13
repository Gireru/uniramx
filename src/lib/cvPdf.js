import { jsPDF } from "jspdf";

const MAY = "#E6005C";
const TINTA = "#14193F";
const GRIS = "#5B6180";

export function descargarCV(cv) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  let y = 56;

  doc.setFillColor(MAY);
  doc.rect(0, 0, W, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(TINTA);
  doc.text(cv.nombre || "Mi curriculum", M, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(GRIS);
  const contacto = [cv.correo, cv.telefono, cv.ciudad, cv.enlace].filter(Boolean).join("  ·  ");
  doc.text(contacto, M, y, { maxWidth: W - M * 2 });
  y += 26;

  const seccion = (titulo) => {
    if (y > 760) { doc.addPage(); y = 56; }
    doc.setDrawColor(MAY);
    doc.setLineWidth(2);
    doc.line(M, y - 6, M + 26, y - 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(MAY);
    doc.text(titulo.toUpperCase(), M + 34, y);
    y += 16;
    doc.setTextColor(TINTA);
  };
  const parrafo = (t, size = 10, color = TINTA, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lineas = doc.splitTextToSize(String(t || ""), W - M * 2);
    lineas.forEach((l) => {
      if (y > 780) { doc.addPage(); y = 56; }
      doc.text(l, M, y);
      y += size + 4;
    });
  };

  if (cv.resumen) { seccion("Perfil"); parrafo(cv.resumen); y += 10; }
  if (cv.educacion?.length) {
    seccion("Formación");
    cv.educacion.forEach((e) => { parrafo(`${e.grado || ""}${e.institucion ? " · " + e.institucion : ""}${e.periodo ? "  (" + e.periodo + ")" : ""}`, 10, TINTA, true); if (e.detalle) parrafo(e.detalle, 9.5, GRIS); y += 4; });
    y += 6;
  }
  if (cv.experiencia?.length) {
    seccion("Experiencia");
    cv.experiencia.forEach((e) => { parrafo(`${e.puesto || ""}${e.lugar ? " · " + e.lugar : ""}${e.periodo ? "  (" + e.periodo + ")" : ""}`, 10, TINTA, true); if (e.detalle) parrafo(e.detalle, 9.5, GRIS); y += 4; });
    y += 6;
  }
  [["Habilidades", cv.habilidades], ["Idiomas", cv.idiomas], ["Certificaciones", cv.certificaciones]].forEach(([t, l]) => {
    if (l?.length) { seccion(t); parrafo(l.join(" · ")); y += 10; }
  });
  if (cv.referencias?.length) {
    seccion("Referencias");
    cv.referencias.forEach((r) => parrafo(`${r.nombre || ""}${r.contacto ? " — " + r.contacto : ""}`, 9.5));
  }

  doc.setFontSize(8);
  doc.setTextColor(GRIS);
  doc.text("Hecho con Unira · Te unimos con tu oportunidad", M, doc.internal.pageSize.getHeight() - 28);
  doc.save(`CV-${(cv.nombre || "unira").replace(/\s+/g, "-")}.pdf`);
}