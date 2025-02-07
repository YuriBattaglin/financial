import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to, from) => {

    if (process.server) return;

    const { isAuthenticated, renewSession } = useAuth();

    if (isAuthenticated()) {
        if (to.path === '/auth/login' || to.path === '/register/login') {
            return navigateTo('/dashboard');
        }

        renewSession(); 
    } else {
        if (to.path !== '/auth/login' && to.path !== '/auth/register') {
            return navigateTo('/auth/login'); 
        }
    }
});