import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Signup() {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const emailTrimmed = email.trim().toLowerCase();
    
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    
    const existing = JSON.parse(localStorage.getItem("budgetbasic_account") || "null");
    if (existing && existing.email === emailTrimmed) {
      setMessage("An account with this email already exists. Please login.");
      return;
    }
    
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
    const passwordHash = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
    
    const account = { name: `${first.trim()} ${last.trim()}`, email: emailTrimmed, passwordHash, createdAt: Date.now() };
    localStorage.setItem("budgetbasic_account", JSON.stringify(account));
    localStorage.setItem("budgetbasic_session", JSON.stringify({ email: emailTrimmed, name: account.name, loggedIn: true, loginAt: Date.now() }));
    
    setMessage("Account created. Opening your dashboard...");
    setTimeout(() => navigate('/dashboard'), 350);
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <main className="auth-wrap">
        <aside className="auth-side">
          <Link className="brand" to="/">
            <span className="brand-mark">◆</span>
            <span>Budget<span className="gold-text">Basic</span><small>SMART MONEY LEARNING</small></span>
          </Link>
          <h1>Create your<br/><span className="gold-text">learning space.</span></h1>
          <p>Demo registration for the front-end prototype. Do not enter banking or sensitive financial information.</p>
        </aside>
        <section className="auth-main">
          <Link className="back-home" to="/">← Back to BudgetBasic</Link>
          <h2>Create account.</h2>
          <p>Client-side validation only — no server submission.</p>
          <form className="auth-form" onSubmit={handleSignup}>
            <div className="form-row">
              <div>
                <label htmlFor="first">First name</label>
                <input className="field" id="first" required value={first} onChange={e => setFirst(e.target.value.replace(/[0-9]/g, ''))} />
              </div>
              <div>
                <label htmlFor="last">Last name</label>
                <input className="field" id="last" required value={last} onChange={e => setLast(e.target.value.replace(/[0-9]/g, ''))} />
              </div>
            </div>
            
            <label htmlFor="email">Email</label>
            <input className="field" id="email" type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            
            <label htmlFor="password">Password</label>
            <input className="field" id="password" type="password" minLength="6" required value={password} onChange={e => setPassword(e.target.value)} />
            
            <label htmlFor="confirm">Confirm password</label>
            <input className="field" id="confirm" type="password" minLength="6" required value={confirm} onChange={e => setConfirm(e.target.value)} />
            
            <div className="auth-actions">
              <button className="btn btn-gold" type="submit">Create demo account</button>
              <Link className="btn btn-outline" to="/login">Already have an account?</Link>
            </div>
            {message && <p className="auth-message" style={{color: message.startsWith("Account created") ? "#62d9a3" : "#ff7777"}}>{message}</p>}
          </form>
        </section>
      </main>
    </div>
    </>
  );
}
