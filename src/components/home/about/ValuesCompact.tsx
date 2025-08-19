"use client";

const VALUES = [
  {
    title: "Personalización",
    text: "Nada genérico: soluciones diseñadas para tu contexto.",
  },
  {
    title: "Transparencia",
    text: "Expectativas claras y comunicación directa.",
  },
  { title: "Pasión", text: "Nos importa el resultado, no el PowerPoint." },
  { title: "Empuje", text: "Seguimiento y ejecución hasta lograr impacto." },
  {
    title: "Co-creación",
    text: "Trabajamos con tu equipo, no a espaldas de él.",
  },
  { title: "Excelencia", text: "Si no podemos hacerlo bien, no lo tomamos." },
];

const ValuesCompact = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {VALUES.map((v, idx) => (
      <div
        key={idx}
        className="rounded-2xl border p-5 bg-card shadow-sm"
        data-animate
      >
        <h4 className="font-semibold mb-1">{v.title}</h4>
        <p className="text-sm text-muted-foreground">{v.text}</p>
      </div>
    ))}
  </div>
);

export default ValuesCompact;
