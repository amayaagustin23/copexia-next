"use client";

export default function HomePage() { 
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">
        Bienvenido a <span className="text-primary">Aliviarte</span>
      </h1>
      <p className="text-muted-foreground text-lg max-w-xl mb-6">
        Una plataforma para gestionar tu bienestar emocional. Iniciá sesión para
        acceder a tu espacio personal.
      </p>
    </main>
  );
}
