const USER_KEY = 'auth_user';
const TOKEN_KEY = 'auth_token';

export function setSession(token, user) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getSessionUser() {
    if (typeof window === 'undefined') return null;
    const userRaw = localStorage.getItem(USER_KEY);
    if (!userRaw) return null;

    try {
        return JSON.parse(userRaw);
    } catch {
        return null;
    }
}
