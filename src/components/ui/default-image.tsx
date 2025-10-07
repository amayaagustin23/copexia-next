"use client";

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface DefaultImageProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  translationKey?: string;
}

export function DefaultImage({ 
  className, 
  size = 'md', 
  showText = true,
  translationKey = 'noImage'
}: DefaultImageProps) {
  const t = useTranslations();

  const sizeClasses = {
    sm: {
      container: 'h-28 xs:h-32 sm:h-40 lg:h-48',
      iconContainer: 'w-12 h-12 xs:w-16 xs:h-16',
      icon: 'w-6 h-6 xs:w-8 xs:h-8',
      text: 'text-[10px] xs:text-xs',
      padding: 'p-4',
      margin: 'mb-2 xs:mb-3'
    },
    md: {
      container: 'h-64 md:h-96',
      iconContainer: 'w-20 h-20 md:w-24 md:h-24',
      icon: 'w-10 h-10 md:w-12 md:h-12',
      text: 'text-sm md:text-base',
      padding: 'p-8',
      margin: 'mb-4'
    },
    lg: {
      container: 'h-80 md:h-[500px]',
      iconContainer: 'w-24 h-24 md:w-32 md:h-32',
      icon: 'w-12 h-12 md:w-16 md:h-16',
      text: 'text-base md:text-lg',
      padding: 'p-12',
      margin: 'mb-6'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn(
      "w-full bg-gradient-to-br from-primary/10 via-primary/5 to-muted/20 flex items-center justify-center group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-muted/30 transition-all duration-300",
      currentSize.container,
      className
    )}>
      <div className={cn("text-center", currentSize.padding)}>
        <div className={cn(
          "mx-auto bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300",
          currentSize.iconContainer,
          currentSize.margin
        )}>
          <svg
            className={cn(
              "text-primary/60 group-hover:text-primary/80 transition-colors duration-300",
              currentSize.icon
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
            />
          </svg>
        </div>
        {showText && (
          <p className={cn(
            "text-primary/60 group-hover:text-primary/80 font-medium transition-colors duration-300",
            currentSize.text
          )}>
            {t(translationKey)}
          </p>
        )}
      </div>
    </div>
  );
}
