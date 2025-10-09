/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@/actions/*' {
    const action: any;
    export default action;
}

type RouteInvocation = string & {
    url: (...args: unknown[]) => string;
    form: (...args: unknown[]) => Record<string, unknown>;
};

type RouteHelper = ((...args: unknown[]) => RouteInvocation) & RouteInvocation;

declare module '@/routes' {
    export const dashboard: RouteHelper;
    export const login: RouteHelper;
    export const register: RouteHelper;
    export const logout: RouteHelper;
    export const home: RouteHelper;
    const routes: Record<string, RouteHelper>;
    export default routes;
}

declare module '@/routes/*' {
    export const edit: RouteHelper;
    export const update: RouteHelper;
    export const show: RouteHelper;
    export const store: RouteHelper;
    export const enable: RouteHelper;
    export const disable: RouteHelper;
    export const confirm: RouteHelper;
    export const request: RouteHelper;
    export const send: RouteHelper;
    export const regenerateRecoveryCodes: RouteHelper;
    export const qrCode: RouteHelper;
    export const recoveryCodes: RouteHelper;
    export const secretKey: RouteHelper;
    export const login: RouteHelper;
    const routes: Record<string, RouteHelper>;
    export default routes;
}
