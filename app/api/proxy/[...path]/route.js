import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000/api';

async function forwardRequest(request, context) {
    try {
        const resolvedParams = await context.params;
        const path = (resolvedParams?.path || []).join('/');
        const targetUrl = `${BACKEND_API_URL}/${path}${request.nextUrl.search}`;

        const headers = new Headers(request.headers);
        headers.delete('host');
        headers.delete('content-length');

        const contentType = request.headers.get('content-type') || '';
        const isMultipart = contentType.includes('multipart/form-data');
        let body;

        if (request.method !== 'GET' && request.method !== 'HEAD') {
            if (contentType.includes('application/json')) {
                body = await request.text();
            } else if (isMultipart) {
                body = await request.formData();
                // Let fetch rebuild proper boundary for multipart payload.
                headers.delete('content-type');
            } else {
                body = await request.arrayBuffer();
            }
        }

        const response = await fetch(targetUrl, {
            method: request.method,
            headers,
            body,
            cache: 'no-store',
        });

        const responseHeaders = new Headers(response.headers);
        responseHeaders.delete('content-encoding');
        responseHeaders.delete('content-length');
        responseHeaders.set('cache-control', 'no-store');

        return new NextResponse(response.body, {
            status: response.status,
            headers: responseHeaders,
        });
    } catch {
        return NextResponse.json(
            { message: "Erreur de proxy: impossible de joindre l'API backend." },
            { status: 502 }
        );
    }
}

export async function GET(request, { params }) {
    return forwardRequest(request, { params });
}

export async function POST(request, { params }) {
    return forwardRequest(request, { params });
}

export async function PATCH(request, { params }) {
    return forwardRequest(request, { params });
}

export async function PUT(request, { params }) {
    return forwardRequest(request, { params });
}

export async function DELETE(request, { params }) {
    return forwardRequest(request, { params });
}

export async function OPTIONS(request, { params }) {
    return forwardRequest(request, { params });
}
