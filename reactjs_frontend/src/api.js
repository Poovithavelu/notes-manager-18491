const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// Simple localStorage helpers to persist JWT across sessions
const TOKEN_KEY = 'notes_jwt_token';

// PUBLIC_INTERFACE
export function getToken() {
  /** Get persisted JWT token string or null. */
  return localStorage.getItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Persist JWT token string in localStorage. */
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

// PUBLIC_INTERFACE
export function clearToken() {
  /** Remove JWT token from localStorage. */
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Build fetch options with JSON headers and Authorization when token is present.
 */
function buildOptions(method = 'GET', body = null, includeAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  const options = { method, headers };
  if (body !== null) {
    options.body = JSON.stringify(body);
  }
  return options;
}

/**
 * Handle common response logic, parsing JSON and surfacing helpful errors.
 */
async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    let message = 'Request failed';
    if (data && typeof data === 'object') {
      message = data.detail || data.message || JSON.stringify(data);
    } else if (typeof data === 'string' && data.trim()) {
      message = data;
    }
    const error = new Error(message);
    error.status = res.status;
    error.payload = data;
    throw error;
  }

  return data;
}

// PUBLIC_INTERFACE
export async function registerUser({ username, password }) {
  /** Register a new user at /register. Returns success or throws error. */
  const res = await fetch(`${API_BASE_URL}/register`, buildOptions('POST', { username, password }, false));
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function loginUser({ username, password }) {
  /** Login at /login, save JWT on success, and return token/payload. */
  const res = await fetch(`${API_BASE_URL}/login`, buildOptions('POST', { username, password }, false));
  const data = await handleResponse(res);
  // Expecting response contains { access_token } or similar. Be flexible.
  const token = data.access_token || data.token || data.jwt || null;
  if (!token) {
    throw new Error('Login succeeded but no token was returned by the server.');
  }
  setToken(token);
  return data;
}

// PUBLIC_INTERFACE
export async function listNotes() {
  /** Fetch current user's notes from /notes. */
  const res = await fetch(`${API_BASE_URL}/notes`, buildOptions('GET', null, true));
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function createNote({ title, content }) {
  /** Create a new note at /notes. */
  const res = await fetch(`${API_BASE_URL}/notes`, buildOptions('POST', { title, content }, true));
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function updateNote(id, { title, content }) {
  /** Update a note by id using PUT /notes/{id}. */
  const res = await fetch(`${API_BASE_URL}/notes/${encodeURIComponent(id)}`, buildOptions('PUT', { title, content }, true));
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id using DELETE /notes/{id}. */
  const res = await fetch(`${API_BASE_URL}/notes/${encodeURIComponent(id)}`, buildOptions('DELETE', null, true));
  if (res.status === 204) return true;
  return handleResponse(res);
}
