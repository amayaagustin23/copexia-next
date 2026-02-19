"use client";

import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import HardBreak from '@tiptap/extension-hard-break';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Code2,

  Minus,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface TiptapEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Botón genérico de la barra de herramientas
const ToolbarButton = ({
  onClick,
  isActive,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onMouseDown={(e) => {
      // Prevenir que el editor pierda el foco al hacer click en los botones
      e.preventDefault();
      onClick();
    }}
    disabled={disabled}
    title={title}
    className={cn(
      "p-1.5 rounded transition-all text-sm font-medium",
      "hover:bg-muted-foreground/15 active:scale-95",
      "disabled:opacity-30 disabled:cursor-not-allowed",
      isActive
        ? "bg-primary/15 text-primary shadow-sm"
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    {children}
  </button>
);

// Divisor vertical
const Divider = () => (
  <div className="w-px h-5 bg-border mx-0.5 self-center shrink-0" />
);



const MenuBar = ({ editor }: { editor: ReturnType<typeof useEditor> }) => {
  const t = useTranslations('TiptapEditor.toolbar');

  // useEditorState garantiza que MenuBar se re-renderiza en CADA cambio de estado
  // del editor (selección, transacción, stored marks, etc.)
  const state = useEditorState({
    editor: editor!,
    selector: (ctx) => ({
      isBold:        ctx.editor?.isActive('bold')              ?? false,
      isItalic:      ctx.editor?.isActive('italic')            ?? false,
      isUnderline:   ctx.editor?.isActive('underline')         ?? false,
      isStrike:      ctx.editor?.isActive('strike')            ?? false,
      isH1:          ctx.editor?.isActive('heading', { level: 1 }) ?? false,
      isH2:          ctx.editor?.isActive('heading', { level: 2 }) ?? false,
      isH3:          ctx.editor?.isActive('heading', { level: 3 }) ?? false,
      isBullet:      ctx.editor?.isActive('bulletList')        ?? false,
      isOrdered:     ctx.editor?.isActive('orderedList')       ?? false,
      isBlockquote:  ctx.editor?.isActive('blockquote')        ?? false,
      isCodeBlock:   ctx.editor?.isActive('codeBlock')         ?? false,
      isLink:        ctx.editor?.isActive('link')              ?? false,
      canUndo:       ctx.editor?.can().undo()                  ?? false,
      canRedo:       ctx.editor?.can().redo()                  ?? false,
    }),
  });

  // ⚠️ Todos los hooks ANTES del early return (Rules of Hooks)

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href as string;
    const url = window.prompt('URL del enlace:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('URL de la imagen:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };


  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/30">

      {/* Texto: Negrita, Cursiva, Subrayado, Tachado */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={state.isBold}
        title={t('bold')}
      >
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={state.isItalic}
        title={t('italic')}
      >
        <Italic size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={state.isUnderline}
        title={t('underline')}
      >
        <UnderlineIcon size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={state.isStrike}
        title={t('strike')}
      >
        <Strikethrough size={15} />
      </ToolbarButton>

      <Divider />

      {/* Encabezados */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={state.isH1}
        title={t('heading1')}
      >
        <Heading1 size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={state.isH2}
        title={t('heading2')}
      >
        <Heading2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={state.isH3}
        title={t('heading3')}
      >
        <Heading3 size={15} />
      </ToolbarButton>

      <Divider />

      {/* Listas */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={state.isBullet}
        title={t('listBullet')}
      >
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={state.isOrdered}
        title={t('listOrdered')}
      >
        <ListOrdered size={15} />
      </ToolbarButton>

      <Divider />

      {/* Bloques */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={state.isBlockquote}
        title={t('blockquote')}
      >
        <Quote size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={state.isCodeBlock}
        title={t('codeBlock')}
      >
        <Code2 size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Línea horizontal"
      >
        <Minus size={15} />
      </ToolbarButton>

      <Divider />

      {/* Link e imagen */}
      <ToolbarButton
        onClick={setLink}
        isActive={state.isLink}
        title={t('link')}
      >
        <LinkIcon size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={addImage}
        title={t('image')}
      >
        <ImageIcon size={15} />
      </ToolbarButton>



      {/* Spacer */}
      <div className="flex-1" />

      {/* Undo / Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!state.canUndo}
        title="Deshacer (Ctrl+Z)"
      >
        <Undo size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!state.canRedo}
        title="Rehacer (Ctrl+Y)"
      >
        <Redo size={15} />
      </ToolbarButton>
    </div>
  );
};

export function TiptapEditor({
  value = '',
  onChange,
  placeholder,
  className,
}: TiptapEditorProps) {
  const t = useTranslations('TiptapEditor');
  const finalPlaceholder = placeholder || t('placeholder');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: false, // desactivamos el nativo para usar el nuestro
      }),
      // Shift+Enter → <br>  (salto de línea suave dentro del bloque)
      // Enter → nuevo bloque (párrafo/heading) — permite aplicar H1 por línea
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            'Shift-Enter': () => this.editor.commands.setHardBreak(),
          };
        },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: finalPlaceholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const raw = editor.getHTML();
      // Elimina párrafos vacíos al inicio y al final del contenido
      const html = raw
        .replace(/^(\s*<p>\s*<\/p>\s*)+/, '')
        .replace(/(\s*<p>\s*<\/p>\s*)+$/, '')
        .trim();
      console.log('[TiptapEditor] HTML:', html);
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content focus:outline-none min-h-[240px] p-4',
      },
    },
    immediatelyRender: false,
  });

  // Sincronizar valor externo → editor (sin bucle)
  useEffect(() => {
    if (editor && !editor.isFocused && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div
      className={cn(
        "flex flex-col border rounded-lg overflow-hidden bg-background",
        "focus-within:ring-2 focus-within:ring-ring/30 transition-shadow shadow-sm",
        className
      )}
    >
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />

    </div>
  );
}
