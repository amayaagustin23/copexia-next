'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ConsentStatus = 'granted' | 'denied' | null;

interface CookieConsentContextType {
    consent: ConsentStatus;
    setConsent: (status: ConsentStatus) => void;
    showBanner: boolean;
    acceptCookies: () => void;
    declineCookies: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [consent, setConsentState] = useState<ConsentStatus>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Check localStorage on mount
        const storedConsent = localStorage.getItem('cookie_consent');
        if (storedConsent === 'granted' || storedConsent === 'denied') {
            setConsentState(storedConsent);
            setShowBanner(false);
        } else {
            setShowBanner(true);
        }
        setIsLoaded(true);
    }, []);

    const setConsent = (status: ConsentStatus) => {
        setConsentState(status);
        if (status) {
            localStorage.setItem('cookie_consent', status);
            setShowBanner(false);
        } else {
            localStorage.removeItem('cookie_consent');
            setShowBanner(true);
        }
    };

    const acceptCookies = () => setConsent('granted');
    const declineCookies = () => setConsent('denied');

    return (
        <CookieConsentContext.Provider
            value={{
                consent,
                setConsent,
                showBanner: isLoaded && showBanner,
                acceptCookies,
                declineCookies,
            }}
        >
            {children}
        </CookieConsentContext.Provider>
    );
}

export function useCookieConsent() {
    const context = useContext(CookieConsentContext);
    if (context === undefined) {
        throw new Error('useCookieConsent must be used within a CookieConsentProvider');
    }
    return context;
}
