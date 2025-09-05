import React, { useState } from 'react';
import { loginUser, registerUser } from '../api';
import './styles.css';

// PUBLIC_INTERFACE
export default function AuthModal({ mode: defaultMode = 'login', onClose, onSuccess }) {
  /**
   * Modal dialog for user login or signup.
   * Props:
   * - mode: 'login' | 'signup'
   * - onClose: function to close modal
   * - onSuccess: function({ username }) called after successful auth
   */
  const [mode, setMode] = useState(defaultMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setError('');
    setPassword('');
  };

  const canSubmit = username.trim().length >= 3 && password.trim().length >= 6;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError('');
    try {
      if (mode === 'signup') {
        await registerUser({ username: username.trim(), password: password.trim() });
        // After signup, auto-login for convenience
        await loginUser({ username: username.trim(), password: password.trim() });
      } else {
        await loginUser({ username: username.trim(), password: password.trim() });
      }
      onSuccess?.({ username: username.trim() });
      onClose?.();
    } catch (err) {
      const msg = err?.message || 'Authentication failed';
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{mode === 'login' ? 'Login' : 'Sign up'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✖
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              autoFocus
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              minLength={3}
              required
            />
            <small className="hint">At least 3 characters.</small>
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              minLength={6}
              required
            />
            <small className="hint">At least 6 characters.</small>
          </div>
          {error ? <div className="error">{error}</div> : null}
          <div className="modal-actions">
            <button className="btn secondary" type="button" onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button className="btn primary" type="submit" disabled={!canSubmit || busy}>
              {busy ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </div>
        </form>
        <div className="modal-footer">
          {mode === 'login' ? (
            <button className="link-btn" onClick={switchMode} disabled={busy}>
              New here? Create an account
            </button>
          ) : (
            <button className="link-btn" onClick={switchMode} disabled={busy}>
              Already have an account? Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
