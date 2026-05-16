import { router, usePage } from '@inertiajs/react';

export function useAuth() {
    const page = usePage();
    const user = page.props?.auth?.user ?? null;
    return {
        session: user ? { user } : null,
        user,
        loading: false,
    };
}

export function signOut() {
    router.post('/logout');
}
