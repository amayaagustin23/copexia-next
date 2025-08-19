"use client";
import { CheckCircle2, LineChart, Settings, Users } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: <Users className="h-5 w-5" />,
    title: "Acompañamiento real",
    text: "Nos metemos en el barro con vos: menos promesas, más acción.",
  },
  {
    icon: <Settings className="h-5 w-5" />,
    title: "Implementación simple",
    text: "Elegimos soluciones útiles, no modas. Paso a paso y medible.",
  },
  {
    icon: <LineChart className="h-5 w-5" />,
    title: "Mejora continua",
    text: "Procesos más claros, menos fricción y foco en resultados.",
  },
  {
    icon: <CheckCircle2 className="h-5 w-5" />,
    title: "Transparencia",
    text: "Decimos lo que vemos. Si no suma, no lo hacemos.",
  },
];

const CopexiaHighlightsBand = ({
  heading = "Destacados",
}: {
  heading?: string;
}) => (
  <div className="w-full bg-muted/30 py-10">
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
      <h3 className="text-xl md:text-2xl font-semibold mb-6" data-animate>
        {heading}
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {HIGHLIGHTS.map((c, i) => (
          <div
            key={i}
            className="rounded-2xl border bg-background p-5 shadow-sm hover:shadow transition"
            data-animate
          >
            <div className="flex items-center gap-2 text-primary mb-2">
              {c.icon}
              <span className="font-semibold">{c.title}</span>
            </div>
            <p className="text-sm text-muted-foreground">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CopexiaHighlightsBand;
