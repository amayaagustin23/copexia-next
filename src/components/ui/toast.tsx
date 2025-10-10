"use client";

import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: (id: string) => void;
}

export function Toast({
  id,
  title,
  description,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setIsEntering(false);
    }, 100);

    return () => clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
      }, 50);

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [duration]);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 400);
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const styles = {
    success:
      'bg-card/95 border-primary/30 text-foreground shadow-[0_0_20px_rgba(223,205,129,0.15)]',
    error:
      'bg-card/95 border-destructive/50 text-foreground shadow-[0_0_20px_rgba(229,115,115,0.2)]',
    warning:
      'bg-card/95 border-accent/40 text-foreground shadow-[0_0_20px_rgba(172,116,0,0.15)]',
    info: 'bg-card/95 border-border text-foreground shadow-lg',
  };

  const progressStyles = {
    success: 'bg-primary shadow-[0_0_8px_rgba(223,205,129,0.4)]',
    error: 'bg-destructive shadow-[0_0_8px_rgba(229,115,115,0.4)]',
    warning: 'bg-accent shadow-[0_0_8px_rgba(172,116,0,0.4)]',
    info: 'bg-muted-foreground/60',
  };

  const iconStyles = {
    success: 'text-primary',
    error: 'text-destructive',
    warning: 'text-accent',
    info: 'text-muted-foreground',
  };

  const Icon = icons[type];

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 p-4 border rounded-lg backdrop-blur-md overflow-hidden',
        'transform transition-all duration-500 ease-out',
        styles[type],
        isEntering && 'translate-x-full opacity-0 scale-95',
        !isEntering &&
          !isRemoving &&
          'translate-x-0 opacity-100 scale-100 animate-toast-bounce',
        isRemoving && 'translate-x-full opacity-0 scale-95'
      )}
      style={{
        animation: isEntering
          ? 'none'
          : isRemoving
          ? 'none'
          : 'toastSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted/30">
          <div
            className={cn(
              'h-full transition-all duration-100 ease-linear rounded-full',
              progressStyles[type]
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="relative">
        <Icon
          className={cn(
            'w-5 h-5 flex-shrink-0 mt-0.5',
            iconStyles[type],
            !isEntering && 'animate-toast-icon'
          )}
        />
        {type === 'success' && !isEntering && (
          <div
            className="absolute inset-0 w-5 h-5 rounded-full bg-primary/20 animate-ping"
            style={{ animationDuration: '1s', animationIterationCount: '1' }}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm leading-tight text-foreground">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 leading-snug">
            {description}
          </p>
        )}
      </div>

      <button
        onClick={handleClose}
        className={cn(
          'flex-shrink-0 p-1 rounded-md transition-all duration-200',
          'hover:bg-muted/50 hover:scale-110 text-muted-foreground hover:text-foreground',
          'active:scale-95'
        )}
        aria-label="Cerrar"
      >
        <X className="w-4 h-4" />
      </button>

      <style jsx>{`
        @keyframes toastSlideIn {
          0% {
            transform: translateX(100%) scale(0.95);
            opacity: 0;
          }
          60% {
            transform: translateX(-8px) scale(1.02);
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes toastBounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        @keyframes iconPop {
          0% {
            transform: scale(0.8) rotate(-10deg);
          }
          50% {
            transform: scale(1.2) rotate(5deg);
          }
          100% {
            transform: scale(1) rotate(0);
          }
        }

        :global(.animate-toast-bounce) {
          animation: toastBounce 0.3s ease-out 0.5s;
        }

        :global(.animate-toast-icon) {
          animation: iconPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}

export interface ToastContainerProps {
  toasts: ToastProps[];
  onRemoveToast: (id: string) => void;
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm w-full pointer-events-none">
      <div className="pointer-events-auto space-y-3">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <Toast {...toast} onClose={onRemoveToast} />
          </div>
        ))}
      </div>
    </div>
  );
}
