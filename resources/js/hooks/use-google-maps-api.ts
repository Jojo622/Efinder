import { useEffect, useState } from 'react';

type GoogleMapsStatus = 'idle' | 'loading' | 'ready' | 'error' | 'missing';

type UseGoogleMapsApiOptions = {
    apiKey?: string;
    libraries?: string[];
};

type GoogleMapsWindow = typeof window & {
    google?: unknown;
    gm_authFailure?: () => void;
    __googleMapsOnLoad__?: () => void;
};

export function useGoogleMapsApi({ apiKey, libraries = ['maps', 'marker', 'places'] }: UseGoogleMapsApiOptions): GoogleMapsStatus {
    const [status, setStatus] = useState<GoogleMapsStatus>('idle');

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (!apiKey) {
            setStatus('missing');
            return;
        }

        const win = window as GoogleMapsWindow;
        if (win.google) {
            setStatus('ready');
            return;
        }

        let script = document.querySelector<HTMLScriptElement>('script[data-google-maps]');
        let active = true;

        const handleReady = () => {
            if (!active) return;
            setStatus('ready');
        };

        const handleError = () => {
            if (!active) return;
            setStatus('error');
        };

        const handleAuthFailure = () => {
            if (!active) return;
            setStatus('error');
        };

        win.gm_authFailure = handleAuthFailure;
        win.__googleMapsOnLoad__ = handleReady;

        const uniqueLibraries = Array.from(new Set(libraries.flatMap((library) => library.split(',').map((value) => value.trim()))));
        const librariesParam = uniqueLibraries.join(',') || 'maps,marker,places';

        if (!script) {
            const params = new URLSearchParams({
                key: apiKey,
                libraries: librariesParam,
                v: 'weekly',
                callback: '__googleMapsOnLoad__',
            });

            script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
            script.async = true;
            script.defer = true;
            script.dataset.googleMaps = 'true';
            script.dataset.googleMapsLibraries = librariesParam;
            script.addEventListener('error', handleError);
            document.head.appendChild(script);
        } else {
            const existingLibraries = script.dataset.googleMapsLibraries;
            if (existingLibraries && librariesParam.split(',').some((library) => !existingLibraries.split(',').includes(library))) {
                const params = new URLSearchParams({
                    key: apiKey,
                    libraries: Array.from(
                        new Set([...existingLibraries.split(','), ...librariesParam.split(',')].map((value) => value.trim())),
                    ).join(','),
                    v: 'weekly',
                    callback: '__googleMapsOnLoad__',
                });

                script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
                script.dataset.googleMapsLibraries = params.get('libraries') ?? librariesParam;
            }

            script.addEventListener('error', handleError);
        }

        setStatus('loading');

        return () => {
            active = false;
            script?.removeEventListener('error', handleError);

            if (win.gm_authFailure === handleAuthFailure) {
                delete win.gm_authFailure;
            }

            if (win.__googleMapsOnLoad__ === handleReady) {
                delete win.__googleMapsOnLoad__;
            }
        };
    }, [apiKey, libraries]);

    return status;
}

export default useGoogleMapsApi;
