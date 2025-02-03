export const useAuth = () => {
    const isAuthenticated = () => {
        if (process.server) return false; // Evita execução no servidor

        const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || 'null');

        if (!loggedUser || Date.now() > loggedUser.expirationTime) {
            localStorage.removeItem('loggedUser');
            return false;
        }

        return true;
    };

    const renewSession = () => {
        if (process.server) return;

        const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || 'null');

        if (loggedUser) {
            loggedUser.expirationTime = Date.now() + 60 * 60 * 1000; 
            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        }
    };

    const logout = () => {
        localStorage.removeItem('loggedUser');
        navigateTo('/auth/login');
    };

    return { isAuthenticated, renewSession, logout };
};
