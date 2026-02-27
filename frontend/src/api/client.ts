/**
 * API Client — centralized HTTP calls with JWT auth header.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000';

function getToken(): string | null {
    return localStorage.getItem('verilearn_token');
}

function authHeaders(): Record<string, string> {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE}${path}`;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...(options.headers as Record<string, string> || {}),
    };

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `Request failed: ${res.status}`);
    }

    return res.json();
}

// ========== Auth ==========

export async function apiRegister(name: string, email: string, password: string, role: string) {
    return request<{ access_token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
    });
}

export async function apiLogin(email: string, password: string) {
    return request<{ access_token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export async function apiGetMe() {
    return request<{ id: number; name: string; email: string; role: string }>('/auth/me');
}

// ========== Student ==========

export async function apiSubmitAssignment(text: string, subject: string = 'General') {
    return request<any>('/student/submit-assignment', {
        method: 'POST',
        body: JSON.stringify({ text, subject }),
    });
}

export async function apiSubmitFollowup(assignment_id: number, responses: Record<string, string>) {
    return request<any>('/student/submit-followup', {
        method: 'POST',
        body: JSON.stringify({ assignment_id, responses }),
    });
}

export async function apiGetDashboard() {
    return request<any>('/student/dashboard');
}

export async function apiGetResults(assignmentId: number) {
    return request<any>(`/student/results/${assignmentId}`);
}

// ========== Teacher ==========

export async function apiGetClassAnalytics() {
    return request<any>('/teacher/class-analytics');
}

export async function apiGetStudentsList() {
    return request<any[]>('/teacher/students');
}

export async function apiGetStudentAnalytics(studentId: number) {
    return request<any>(`/teacher/student/${studentId}`);
}
