import React from 'react';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import './AuthPage.css';

function AuthPage({ mode, onModeChange, name, email, password, role, error, busy, onNameChange, onEmailChange, onPasswordChange, onRoleChange, onSubmit, onBack }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isRegister = mode === 'register';

  return (
    <main className="auth-page">
      <section className="auth-page__panel">
        <button type="button" className="auth-page__back" onClick={onBack}>
          <ArrowLeft size={17} /> Back to KalaSpace
        </button>

        <div className="auth-page__form-wrap">
          <p className="auth-page__eyebrow">KalaSpace Global</p>
          <h1>{isRegister ? 'Create an account' : 'Welcome back'}</h1>
          <p className="auth-page__subtitle">
            {isRegister ? 'Join a global community of artists and collectors.' : 'Sign in to continue collecting extraordinary work.'}
          </p>

          <form className="auth-page__form" onSubmit={onSubmit}>
            {isRegister ? (
              <label>
                Full name
                <span className="auth-page__input"><UserRound size={17} /><input type="text" required placeholder="Amelie Laurent" value={name} onChange={(event) => onNameChange(event.target.value)} /></span>
              </label>
            ) : null}
            <label>
              Email
              <span className="auth-page__input"><Mail size={17} /><input type="email" required placeholder="you@example.com" value={email} onChange={(event) => onEmailChange(event.target.value)} /></span>
            </label>
            <label>
              Password
              <span className="auth-page__input"><LockKeyhole size={17} /><input type={showPassword ? 'text' : 'password'} required minLength="6" placeholder="At least 6 characters" value={password} onChange={(event) => onPasswordChange(event.target.value)} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
            </label>
            {isRegister ? (
              <label>
                Account type
                <select value={role} onChange={(event) => onRoleChange(event.target.value)}>
                  <option value="user">Collector</option>
                  <option value="artist">Artist</option>
                </select>
              </label>
            ) : null}
            {error ? <p className="auth-page__error" role="alert">{error}</p> : null}
            <button type="submit" className="auth-page__submit" disabled={busy}>{busy ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}</button>
          </form>

          <p className="auth-page__switch">
            {isRegister ? 'Already have an account?' : 'New to KalaSpace?'}{' '}
            <button type="button" onClick={() => onModeChange(isRegister ? 'login' : 'register')}>
              {isRegister ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </div>
      </section>

      <section className="auth-page__visual" aria-label="KalaSpace artist community">
        <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85" alt="Artists and collectors collaborating around a table" />
        <div className="auth-page__visual-shade" />
        <div className="auth-page__visual-copy">
          <p>Collect with confidence</p>
          <h2>Art connects us across every distance.</h2>
          <span>Original work. Direct artist conversations. A more human way to collect.</span>
        </div>
        <div className="auth-page__avatars"><span>A</span><span>M</span><span>S</span><span>+</span></div>
        <div className="auth-page__event-card"><strong>Daily gallery drop</strong><small>New works from verified artists</small><b>Today · 7:00 PM</b></div>
      </section>
    </main>
  );
}

export default AuthPage;
