"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlignLeft, Bold, Heading1, Heading2, Image, Italic, Link } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface HTMLEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

type TextFormat = 'paragraph' | 'heading1' | 'heading2';

export function HTMLEditor({ 
  value = '', 
  onChange, 
  placeholder = 'Escribe tu contenido...',
  className,
  rows = 10
}: HTMLEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [activeFormat, setActiveFormat] = useState<TextFormat | null>(null);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const insertAtCursor = useCallback((text: string) => {
    execCommand('insertHTML', text);
  }, [execCommand]);

  const wrapSelection = useCallback((openTag: string, closeTag: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      const wrappedText = `${openTag}${selectedText}${closeTag}`;
      range.deleteContents();
      range.insertNode(document.createTextNode(wrappedText));
    } else {
      execCommand('insertHTML', `${openTag}${closeTag}`);
    }
    
    editorRef.current?.focus();
  }, [execCommand]);

  const insertLink = useCallback(() => {
    if (linkUrl.trim() && linkText.trim()) {
      const linkHtml = `<a href="${linkUrl}">${linkText}</a>`;
      insertAtCursor(linkHtml);
      setLinkUrl('');
      setLinkText('');
      setIsLinkDialogOpen(false);
    }
  }, [linkUrl, linkText, insertAtCursor]);

  const insertImage = useCallback(() => {
    if (imageUrl.trim()) {
      const imgHtml = `<img src="${imageUrl}" alt="${imageAlt || ''}" style="max-width: 100%; height: auto;" />`;
      insertAtCursor(imgHtml);
      setImageUrl('');
      setImageAlt('');
      setIsImageDialogOpen(false);
    }
  }, [imageUrl, imageAlt, insertAtCursor]);

  const setFormat = useCallback((format: TextFormat) => {
    switch (format) {
      case 'heading1':
        execCommand('formatBlock', 'h1');
        break;
      case 'heading2':
        execCommand('formatBlock', 'h2');
        break;
      case 'paragraph':
        execCommand('formatBlock', 'p');
        break;
    }
  }, [execCommand]);

  const handleBold = useCallback(() => {
    execCommand('bold');
  }, [execCommand]);

  const handleItalic = useCallback(() => {
    execCommand('italic');
  }, [execCommand]);

  const handleEditorChange = useCallback(() => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const updateActiveStates = useCallback(() => {
    if (!editorRef.current) return;

    // Check current format
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container as Element;
      
      if (element) {
        const tagName = element.tagName.toLowerCase();
        if (tagName === 'h1') setActiveFormat('heading1');
        else if (tagName === 'h2') setActiveFormat('heading2');
        else if (tagName === 'p') setActiveFormat('paragraph');
        else setActiveFormat(null);

        // Check bold/italic
        setIsBoldActive(document.queryCommandState('bold'));
        setIsItalicActive(document.queryCommandState('italic'));
      }
    }
  }, []);

  const handleEditorInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    handleEditorChange();
    setTimeout(updateActiveStates, 0);
  }, [handleEditorChange, updateActiveStates]);

  const handleEditorBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    handleEditorChange();
  }, [handleEditorChange]);

  const handleEditorFocus = useCallback(() => {
    setTimeout(updateActiveStates, 0);
  }, [updateActiveStates]);

  const handleEditorClick = useCallback(() => {
    setTimeout(updateActiveStates, 0);
  }, [updateActiveStates]);

  // Initialize content and handle value changes
  useEffect(() => {
    if (editorRef.current) {
      const currentContent = editorRef.current.innerHTML;
      if (value !== currentContent && value !== undefined) {
        editorRef.current.innerHTML = value || '<p></p>';
      }
    }
  }, [value]);

  const ToolbarButton = ({ 
    onClick, 
    children, 
    title, 
    isActive = false 
  }: {
    onClick: () => void;
    children: React.ReactNode;
    title: string;
    isActive?: boolean;
  }) => (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      title={title}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  );

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
        {/* Text Format */}
        <ToolbarButton 
          onClick={() => setFormat('paragraph')} 
          title="Párrafo"
          isActive={activeFormat === 'paragraph'}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={() => setFormat('heading1')} 
          title="Título 1"
          isActive={activeFormat === 'heading1'}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={() => setFormat('heading2')} 
          title="Título 2"
          isActive={activeFormat === 'heading2'}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Text Style */}
        <ToolbarButton 
          onClick={handleBold} 
          title="Negrita"
          isActive={isBoldActive}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        
        <ToolbarButton 
          onClick={handleItalic} 
          title="Cursiva"
          isActive={isItalicActive}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Insert Elements */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Insertar enlace">
              <Link className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insertar enlace</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="link-url">URL del enlace</Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://ejemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="link-text">Texto del enlace</Label>
                <Input
                  id="link-text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Texto visible"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={insertLink}>
                  Insertar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Insertar imagen">
              <Image className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insertar imagen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-url">URL de la imagen</Label>
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              <div>
                <Label htmlFor="image-alt">Texto alternativo (opcional)</Label>
                <Input
                  id="image-alt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Descripción de la imagen"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={insertImage}>
                  Insertar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* WYSIWYG Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 focus:outline-none prose prose-sm max-w-none border-0 focus:ring-0 focus-visible:ring-0"
        style={{ whiteSpace: 'pre-wrap' }}
        onInput={handleEditorInput}
        onBlur={handleEditorBlur}
        onFocus={handleEditorFocus}
        onClick={handleEditorClick}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        .prose h1 {
          font-size: 1.875rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        
        .prose h2 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.3;
          margin-bottom: 0.75rem;
        }
        
        .prose p {
          margin-bottom: 1rem;
        }
        
        .prose a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }
        
        .prose img {
          border-radius: 0.375rem;
          margin: 1rem 0;
          max-width: 100%;
          height: auto;
        }
        
        .prose strong {
          font-weight: 700;
        }
        
        .prose em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
