import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [time, setTime] = useState('--:--:--');
  const [visits, setVisits] = useState('0');
  const [isLight, setIsLight] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem("budgetbasic_session") || "null");
    if (!s || !s.loggedIn) {
      navigate('/login');
    } else {
      setSession(s);
    }
    
    if (localStorage.getItem("budgetbasic_theme") === "light") {
      document.body.classList.add("light");
      setIsLight(true);
    }
    
    const v = localStorage.getItem("budgetbasic_visits") || "0";
    setVisits(v);

    const timer = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString("en-PK", { hour12: true }));
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const toggleTheme = () => {
    const isNowLight = document.body.classList.toggle("light");
    localStorage.setItem("budgetbasic_theme", isNowLight ? "light" : "dark");
    setIsLight(isNowLight);
  };

  const handleLogout = () => {
    localStorage.removeItem("budgetbasic_session");
    navigate('/');
  };

  if (!session) return null;

  return (
    <div className="dashboard-page">
      <header className="site-header">
        <nav className="nav container" aria-label="Dashboard navigation">
          <Link className="brand" to="/">
            <span className="brand-mark"><i className="fa-solid fa-wallet"></i></span>
            <span>Budget<span className="gold-text">Basic</span><small>SMART MONEY LEARNING</small></span>
          </Link>
          <div className="nav-menu" style={{display: 'flex', position: 'static', padding: 0, background: 'transparent', border: 0, boxShadow: 'none'}}>
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link active" to="/dashboard">Dashboard</Link>
            <a className="nav-link" href="/#about">About Us</a>
            <div className="nav-live">
              <span className="live-dot"></span><span id="dashTime">{time}</span>
            </div>
            <button className="icon-btn" onClick={toggleTheme} type="button" aria-label="Toggle theme">
              {isLight ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}
            </button>
            <button className="nav-auth" onClick={handleLogout} type="button">Logout</button>
          </div>
        </nav>
      </header>
      
      <main className="dash-wrap">
        <section className="dash-top">
          <div className="dash-title">
            <div className="eyebrow"><span className="status-dot"></span> PERSONAL LEARNING DASHBOARD</div>
            <h1>Welcome, <span className="gold-gradient">{session.name || 'Student'}</span>.</h1>
            <p>Track your learning tools and jump back into BudgetBasic from one place.</p>
          </div>
          <div className="dash-actions">
            <span className="dash-user"><i className="fa-solid fa-shield-halved"></i> Demo account</span>
            <a className="btn btn-gold" href="/#rule">Start Planning <i className="fa-solid fa-arrow-right"></i></a>
          </div>
        </section>
        
        <section className="dash-grid">
          <article className="dash-card">
            <i className="fa-solid fa-calculator"></i>
            <b>50/30/20</b>
            <span>Budget calculator</span>
          </article>
          <article className="dash-card">
            <i className="fa-solid fa-bullseye"></i>
            <b>Savings</b>
            <span>Goal planning tool</span>
          </article>
          <article className="dash-card">
            <i className="fa-solid fa-receipt"></i>
            <b>Expenses</b>
            <span>Session planner</span>
          </article>
          <article className="dash-card">
            <i className="fa-solid fa-comments"></i>
            <b>AI Chat</b>
            <span>Budget assistant</span>
          </article>
        </section>
        
        <section className="dash-main">
          <article className="dash-panel">
            <h2>Continue learning</h2>
            <p>All original BudgetBasic modules remain on the main home page. Use these shortcuts instead of changing the existing tools.</p>
            <div className="dash-links">
              <a className="dash-link" href="/#basics"><i className="fa-solid fa-book-open"></i>Budgeting Basics</a>
              <a className="dash-link" href="/#needs"><i className="fa-solid fa-scale-balanced"></i>Needs & Wants</a>
              <a className="dash-link" href="/#rule"><i className="fa-solid fa-chart-pie"></i>50/30/20 Calculator</a>
              <a className="dash-link" href="/#saving"><i className="fa-solid fa-piggy-bank"></i>Savings Goal</a>
              <a className="dash-link" href="/#expenses"><i className="fa-solid fa-receipt"></i>Expense Planner</a>
              <a className="dash-link" href="/#chatbot"><i className="fa-solid fa-robot"></i>Budget Assistant</a>
            </div>
            <h3 style={{marginTop: '28px'}}>Learning progress</h3>
            <div className="dash-progress"><i></i></div>
            <small style={{color: 'var(--muted)'}}>Dashboard progress is a visual demo and does not change your calculators.</small>
          </article>
          
          <aside className="dash-panel">
            <h2>Live status</h2>
            <p>Current browser time</p>
            <div className="dash-clock">{time}</div>
            <p style={{marginTop: '22px'}}>Visitor count</p>
            <div className="dash-clock">{visits}</div>
            <div className="dash-tip" style={{marginTop: '22px'}}>
              <b><i className="fa-solid fa-lightbulb"></i> Tip</b>
              <p style={{margin: '8px 0 0'}}>Use the expense planner for a few days, then review which categories take the most space in your example budget.</p>
            </div>
          </aside>
        </section>
        
        <div className="dash-footer">
          Educational dashboard • No banking or payment processing • <Link to="/sitemap">Sitemap</Link>
        </div>
      </main>
    </div>
  );
}
