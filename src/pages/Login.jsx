import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailTrimmed = email.trim().toLowerCase();
    
    const account = JSON.parse(localStorage.getItem("budgetbasic_account") || "null");
    if (!account || account.email !== emailTrimmed) {
      setMessage("No demo account found for this email. Please register first.");
      return;
    }
    
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
    const encoded = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
    
    if (account.passwordHash !== encoded) {
      setMessage("Incorrect password. Please try again.");
      return;
    }
    
    localStorage.setItem("budgetbasic_session", JSON.stringify({ email: account.email, name: account.name, loggedIn: true, loginAt: Date.now() }));
    setMessage("Login successful. Opening your dashboard...");
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
          <h1>Learn. Plan.<br/><span className="gold-text">Grow.</span></h1>
          <p>Demo login only. This project does not store passwords or use a backend database.</p>
        </aside>
        <section className="auth-main">
          <Link className="back-home" to="/">← Back to BudgetBasic</Link>
          <h2>Welcome back.</h2>
          <p>Use any valid-looking email and password for this front-end demo.</p>
          <form className="auth-form" onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input className="field" id="email" type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            
            <label htmlFor="password">Password</label>
            <input className="field" id="password" type="password" minLength="6" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            
            <div className="auth-actions">
              <button className="btn btn-gold" type="submit">Login <i className="fa-solid fa-arrow-right"></i></button>
              <Link className="btn btn-outline" to="/signup">Create account</Link>
            </div>
            {message && <p className="auth-message" style={{color: message.startsWith("Login") ? "#62d9a3" : "#ff7777"}}>{message}</p>}
          </form>
        </section>
      </main>
    </div>
    </>
  );
}
