'use client';

import { useCookieConsent } from '@/context/CookieConsentContext';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function CookieConsentBanner() {
    const { showBanner, acceptCookies, declineCookies } = useCookieConsent();
    const t = useTranslations('CookieConsent');

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-background/95 backdrop-blur-sm border-t-2 border-primary shadow-2xl">
            <div className="container mx-auto flex flex-col items-center justify-center gap-6 text-center">
                <div className="text-base text-foreground max-w-2xl">
                    <p>{t('message')}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <Button variant="outline" onClick={declineCookies}>
                        {t('decline')}
                    </Button>
                    <Button onClick={acceptCookies}>
                        {t('accept')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
