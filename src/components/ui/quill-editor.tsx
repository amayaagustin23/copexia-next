"use client";

import { cn } from '@/lib/utils';
import '@/styles/quill.css';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

interface QuillEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export function QuillEditor({
  value = '',
  onChange,
  placeholder,
  className,
  readOnly = false
}: QuillEditorProps) {
  const t = useTranslations('QuillEditor');
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const quillRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);
  const QuillClassRef = useRef<any>(null);

  // Use translated placeholder or fallback
  const finalPlaceholder = placeholder || t('placeholder');

  // Ensure component is mounted on client side and load Quill
  useEffect(() => {
    setMounted(true);

    // Dynamically import Quill only on client side
    const loadQuill = async () => {
      try {
        const QuillModule = await import('quill');
        QuillClassRef.current = QuillModule.default;
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    loadQuill();
  }, []);

  // Initialize Quill editor
  useEffect(() => {
    if (mounted && !isLoading && QuillClassRef.current && quillRef.current && !quillInstanceRef.current) {
      // Quill modules configuration with translated labels
      const modules = {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'align': [] }],
          ['link', 'image', 'video'],
          ['blockquote', 'code-block'],
          ['clean']
        ],
        clipboard: {
          matchVisual: false,
        }
      };

      // Custom labels for toolbar items
      const customLabels = {
        'header': {
          '1': t('toolbar.heading1'),
          '2': t('toolbar.heading2'),
          '3': t('toolbar.heading3'),
          '': t('toolbar.normal')
        },
        'bold': t('toolbar.bold'),
        'italic': t('toolbar.italic'),
        'underline': t('toolbar.underline'),
        'strike': t('toolbar.strike'),
        'color': t('toolbar.color'),
        'background': t('toolbar.background'),
        'list': {
          'ordered': t('toolbar.listOrdered'),
          'bullet': t('toolbar.listBullet')
        },
        'indent': {
          '-1': t('toolbar.indentDecrease'),
          '+1': t('toolbar.indentIncrease')
        },
        'align': {
          '': t('toolbar.alignLeft'),
          'center': t('toolbar.alignCenter'),
          'right': t('toolbar.alignRight'),
          'justify': t('toolbar.alignJustify')
        },
        'link': t('toolbar.link'),
        'image': t('toolbar.image'),
        'video': t('toolbar.video'),
        'blockquote': t('toolbar.blockquote'),
        'code-block': t('toolbar.codeBlock'),
        'clean': t('toolbar.clean')
      };

      quillInstanceRef.current = new QuillClassRef.current(quillRef.current, {
        theme: 'snow',
        modules,
        placeholder: finalPlaceholder,
        readOnly
      });


      // Apply custom labels to toolbar with multiple attempts
      const applyTranslations = () => {
        const toolbar = quillInstanceRef.current.getModule('toolbar');
        if (toolbar) {

          // Apply custom labels to header picker
          const headerPicker = toolbar.container.querySelector('.ql-picker.ql-header');
          if (headerPicker) {
            // Update Options
            const options = headerPicker.querySelectorAll('.ql-picker-item');
            options.forEach((option: Element) => {
              const value = option.getAttribute('data-value');
              const headerLabels = customLabels.header as Record<string, string>;
              const text = (value && headerLabels[value]) ? headerLabels[value] : headerLabels[''];

              if (text) {
                option.setAttribute('data-custom-label', text);
                option.textContent = ''; // Clear text content to rely on ::before
              }
            });

            // Update Label (active selection)
            const label = headerPicker.querySelector('.ql-picker-label');
            if (label && !label.getAttribute('data-observer-id')) {
              const updateLabel = () => {
                const value = label.getAttribute('data-value');
                const headerLabels = customLabels.header as Record<string, string>;
                const text = (value && headerLabels[value]) ? headerLabels[value] : headerLabels[''];
                if (text) {
                  label.setAttribute('data-custom-label', text);
                }
              };

              // Initial update
              updateLabel();

              // Observe changes to data-value
              const observer = new MutationObserver(updateLabel);
              observer.observe(label, { attributes: true, attributeFilter: ['data-value'] });

              // Mark as observed to prevent duplicates
              label.setAttribute('data-observer-id', 'true');
            }
          }

          // Apply custom labels to other toolbar buttons
          const buttons = toolbar.container.querySelectorAll('.ql-toolbar button');
          buttons.forEach((button: Element) => {
            const action = button.getAttribute('data-value') || button.classList[1];
            if (action && customLabels[action as keyof typeof customLabels]) {
              button.setAttribute('title', customLabels[action as keyof typeof customLabels] as string);
            }
          });
        }
      };

      // Try multiple times to ensure DOM is ready
      setTimeout(applyTranslations, 100);
      setTimeout(applyTranslations, 300);
      setTimeout(applyTranslations, 500);

      // Set initial content
      if (value) {
        quillInstanceRef.current.root.innerHTML = value;
      }

      // Handle text changes
      quillInstanceRef.current.on('text-change', () => {
        const content = quillInstanceRef.current.root.innerHTML;

        if (onChange && content !== value) {
          onChange(content);
        }
      });

      // Handle image upload
      const toolbar = quillInstanceRef.current.getModule('toolbar');
      toolbar.addHandler('image', () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
          const file = input.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              if (result) {
                const range = quillInstanceRef.current.getSelection();
                quillInstanceRef.current.insertEmbed(range.index, 'image', result);
              }
            };
            reader.readAsDataURL(file);
          }
        };
      });
    }
  }, [mounted, isLoading, finalPlaceholder, readOnly, onChange, value]);

  // Update content when value prop changes
  useEffect(() => {
    if (quillInstanceRef.current && value !== quillInstanceRef.current.root.innerHTML) {
      quillInstanceRef.current.root.innerHTML = value;
    }
  }, [value]);

  // Update readOnly state
  useEffect(() => {
    if (quillInstanceRef.current) {
      quillInstanceRef.current.enable(!readOnly);
    }
  }, [readOnly]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current = null;
      }
    };
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className={cn("min-h-[200px] p-4 border rounded-lg bg-muted/20 animate-pulse", className)}>
        <div className="h-4 bg-muted rounded mb-2"></div>
        <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className={cn("quill-editor-wrapper", className)}>
      <div ref={quillRef} />
    </div>
  );
}
