import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware((to, from) => {

    if (process.server) return;

    const { isAuthenticated, renewSession } = useAuth();

    if (isAuthenticated()) {
        // Se estiver logado e tentar acessar login ou register, redireciona para a dashboard
        if (to.path === '/auth/login' || to.path === '/register/login') {
            return navigateTo('/dashboard');
        }

        renewSession(); // Renova o tempo de sessão
    } else {
        if (to.path !== '/auth/login' && to.path !== '/auth/register') {
            return navigateTo('/auth/login'); // Redireciona para o login se não estiver autenticado
        }
    }
});