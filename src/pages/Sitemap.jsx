import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../App.css';

export default function Sitemap() {
  return (
    <>
      <Navbar />
      <main className="section" style={{ paddingTop: '100px' }}>
        <div className="container">
          <Link className="back-home" to="/">← Back to BudgetBasic</Link>
          <div className="section-head" style={{ marginTop: '35px' }}>
            <span className="eyebrow">SITE MAP</span>
            <h1>Everything in one place.</h1>
            <p>Visible navigation and module map for the BudgetBasic educational prototype.</p>
          </div>
          <div className="cards-grid four">
            <Link className="info-card" to="/#home">
              <div className="card-icon">01</div><h3>Home</h3><p>Welcome banner, tips, visitor counter and live date/time.</p>
            </Link>
            <Link className="info-card" to="/#basics">
              <div className="card-icon">02</div><h3>Budgeting Basics</h3><p>Core concepts, sample student budget and knowledge check.</p>
            </Link>
            <Link className="info-card" to="/#needs">
              <div className="card-icon">03</div><h3>Needs vs Wants</h3><p>Examples, interactive classifier and decision guide.</p>
            </Link>
            <Link className="info-card" to="/#rule">
              <div className="card-icon">04</div><h3>50/30/20</h3><p>Income calculator with validation and progress bars.</p>
            </Link>
            <Link className="info-card" to="/#saving">
              <div className="card-icon">05</div><h3>Savings Goals</h3><p>Target, current savings, contribution and time estimate.</p>
            </Link>
            <Link className="info-card" to="/#expenses">
              <div className="card-icon">06</div><h3>Expense Planner</h3><p>Add and remove session-only expense entries.</p>
            </Link>
            <Link className="info-card" to="/#mistakes">
              <div className="card-icon">07</div><h3>Money Mistakes</h3><p>Expandable scenarios and corrective actions.</p>
            </Link>
            <Link className="info-card" to="/#infographics">
              <div className="card-icon">08</div><h3>Learning Gallery</h3><p>Filterable visual cards with captions and accessible labels.</p>
            </Link>
            <Link className="info-card" to="/#chatbot">
              <div className="card-icon">09</div><h3>AI Chatbot</h3><p>Rule-based keyword matching, prompts and safe fallback.</p>
            </Link>
            <Link className="info-card" to="/#feedback">
              <div className="card-icon">10</div><h3>Feedback</h3><p>Name, email, rating and comments with client-side validation.</p>
            </Link>
            <Link className="info-card" to="/#about">
              <div className="card-icon">11</div><h3>About</h3><p>Purpose, constraints and Tech Wizards project team.</p>
            </Link>
            <Link className="info-card" to="/#contact">
              <div className="card-icon">12</div><h3>Contact</h3><p>Email, phone and identified external social link.</p>
            </Link>
            <Link className="info-card" to="/login">
              <div className="card-icon">13</div><h3>Login</h3><p>Front-end demo only; no password storage.</p>
            </Link>
            <Link className="info-card" to="/signup">
              <div className="card-icon">14</div><h3>Sign Up</h3><p>Front-end validation only; no account database.</p>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
