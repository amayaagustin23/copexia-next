"use client";

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { HTMLEditor } from './html-editor';

export function HTMLEditorDemo() {
  const [content, setContent] = useState(`
    <h1>Título principal</h1>
    <p>Este es un párrafo normal con <strong>texto en negrita</strong> y <em>texto en cursiva</em>.</p>
    <h2>Subtítulo</h2>
    <p>Párrafo con <a href="https://ejemplo.com">un enlace</a> incluido.</p>
  `);

  const [previewContent, setPreviewContent] = useState('');

  const handlePreview = () => {
    setPreviewContent(content);
  };

  const handleClear = () => {
    setContent('');
    setPreviewContent('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Editor HTML Personalizado</h1>
        <p className="text-muted-foreground">
          Editor con tipos de texto, cursiva, negrita, enlaces e imágenes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Editor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <HTMLEditor
              value={content}
              onChange={setContent}
              placeholder="Escribe tu contenido aquí..."
            />
            
            <div className="flex gap-2">
              <Button onClick={handlePreview} variant="default">
                Vista previa
              </Button>
              <Button onClick={handleClear} variant="outline">
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Vista previa</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none min-h-[300px] p-4 border rounded-lg bg-muted/20"
              dangerouslySetInnerHTML={{ __html: previewContent || '<p class="text-muted-foreground">Haz clic en "Vista previa" para ver el contenido</p>' }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Raw HTML */}
      <Card>
        <CardHeader>
          <CardTitle>HTML generado</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-40">
            <code>{content}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
