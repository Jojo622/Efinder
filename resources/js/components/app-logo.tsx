import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 text-white shadow-lg ring-1 ring-white/40">
                <AppLogoIcon className="size-5 fill-current text-white" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm text-white">
                <span className="mb-0.5 truncate text-base font-semibold leading-tight">
                    Dagupan E-Finder
                </span>
                <span className="text-xs uppercase tracking-[0.28em] text-white/60">
                    Admin Suite
                </span>
            </div>
        </>
    );
}
