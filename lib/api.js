const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/proxy';

export async function apiRequest(path, options = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const isFormData = options.body instanceof FormData;
    const headers = {
        ...(options.headers || {}),
    };

    if (!isFormData) {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers,
        });
    } catch {
        throw new Error("Connexion impossible au serveur. Verifiez que l'API Laravel tourne et que le port est correct.");
    }

    const rawText = await response.text().catch(() => '');
    let data = {};
    try {
        data = rawText ? JSON.parse(rawText) : {};
    } catch {
        data = {};
    }

    if (!response.ok) {
        const validationMessage =
            data?.errors && typeof data.errors === 'object'
                ? Object.values(data.errors).flat()[0]
                : null;

        throw new Error(
            validationMessage ||
            data?.message ||
            (rawText && rawText.length < 300 ? rawText : null) ||
            `Request failed (${response.status})`
        );
    }

    return data;
}

export { API_BASE_URL };
