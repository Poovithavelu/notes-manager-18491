import React from 'react';
import './styles.css';

// PUBLIC_INTERFACE
export default function Header({ isAuthenticated, username, onLoginClick, onSignupClick, onLogoutClick }) {
  /** Header bar with navigation and authentication status/actions. */
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-icon">📝</span>
        <span className="brand-name">Notes</span>
      </div>
      <nav className="nav">
        {isAuthenticated ? (
          <div className="auth-info">
            <span className="welcome">Hello, {username || 'User'}</span>
            <button className="btn secondary" onClick={onLogoutClick} aria-label="Log out">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-actions">
            <button className="btn primary" onClick={onLoginClick} aria-label="Open login">
              Login
            </button>
            <button className="btn accent" onClick={onSignupClick} aria-label="Open signup">
              Sign up
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
