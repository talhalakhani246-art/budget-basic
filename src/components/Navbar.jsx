import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [isLight, setIsLight] = useState(false);
  const [time, setTime] = useState('--:--:--');
  const [visits, setVisits] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [topSearchValue, setTopSearchValue] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // Session
    try {
      const s = JSON.parse(localStorage.getItem("budgetbasic_session") || "null");
      setSession(s);
    } catch (e) {}

    // Theme
    if (localStorage.getItem("budgetbasic_theme") === "light") {
      document.body.classList.add("light");
      setIsLight(true);
    }

    // Visits
    const v = Number(localStorage.getItem("budgetbasic_visits") || 0) + 1;
    if (location.pathname === '/') {
      localStorage.setItem("budgetbasic_visits", String(v));
      setVisits(v);
    } else {
      setVisits(Number(localStorage.getItem("budgetbasic_visits") || 0));
    }

    // Clock
    const timer = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString("en-PK", { hour12: true }));
    }, 1000);

    return () => clearInterval(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.nav-dropdown')) setOpenDropdown(null);
      if (!e.target.closest('.nav-search-wrap')) setIsSearchOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const toggleTheme = (e) => {
    e.preventDefault();
    const isNowLight = document.body.classList.toggle("light");
    localStorage.setItem("budgetbasic_theme", isNowLight ? "light" : "dark");
    setIsLight(isNowLight);
  };

  const handleLogout = () => {
    localStorage.removeItem("budgetbasic_session");
    window.location.reload();
  };

  const goToSearch = () => {
    const el = document.getElementById('search');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTopSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      goToSearch();
      setIsMenuOpen(false);
      setIsSearchOpen(false);
    }
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  const toggleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSearchOpen(prev => !prev);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setIsSearchOpen(false);
  };

  const loggedIn = !!(session && session.loggedIn);
  const userName = session?.name || session?.email || "User";

  return (
    <header className="site-header" id="siteHeader">
      <style>{`
        .nav-dropdown {
          position: relative;
          display: inline-block;
        }
        .dropdown-menu {
          display: none;
          position: absolute;
          background-color: var(--card-bg, #1a1a24);
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
          z-index: 1000;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          top: 100%;
          left: 0;
        }
        .dropdown-menu .nav-link {
          padding: 12px 16px;
          text-decoration: none;
          display: block;
          color: white;
          text-align: left;
        }
        .dropdown-menu .nav-link:hover {
          background-color: rgba(255,255,255,0.1);
        }
        .dropdown-toggle {
          background: none;
          border: 0;
          font: inherit;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        @media (hover: hover) {
          .nav-dropdown:hover .dropdown-menu {
            display: block;
          }
          .nav-dropdown:hover .dropdown-toggle {
            color: #d9a441;
          }
        }
        .nav-dropdown.open .dropdown-menu {
          display: block;
        }
        .nav-dropdown.open .dropdown-toggle {
          color: #d9a441;
        }
        .nav-search-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .nav-search-wrap .nav-search {
          display: none;
        }
        .nav-search-wrap.open .nav-search {
          display: flex;
        }
        @media (min-width: 851px) {
          .nav-search-wrap .nav-search {
            position: absolute;
            top: 130%;
            right: 0;
            z-index: 1000;
            width: 220px !important;
          }
          .nav-search-wrap.open .nav-search:focus-within {
            width: 240px !important;
          }
        }
        @media (max-width: 850px) {
          .nav-search-wrap {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }
          .nav-search-wrap .nav-search-toggle {
            width: 100%;
            border-radius: 10px;
            justify-content: flex-start;
            gap: 8px;
            padding: 11px 12px;
          }
          .nav-search-wrap .nav-search {
            width: 100% !important;
            margin: 4px 0 0 !important;
          }
          .dropdown-menu {
            position: static;
            box-shadow: none;
            border: none;
            background: rgba(255,255,255,0.03);
            min-width: 0;
            margin: 2px 0 6px 10px;
            display: none;
          }
          .nav-dropdown.open .dropdown-menu {
            display: block;
          }
          .dropdown-toggle {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
      <nav className="nav container" aria-label="Main navigation">
        <Link className="brand" to="/" aria-label="BudgetBasic home">
          <span className="brand-mark"><img src="/Assets/img/budgetbasic-logo.svg" alt="BudgetBasic" width="28" height="28" /></span>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '3px' }}>
            <span>Budget<span className="gold-text">Basic</span></span>
            <small style={{ margin: 0, display: 'block', letterSpacing: '1.5px', lineHeight: '1' }}>SMART MONEY LEARNING</small>
          </span>
        </Link>
        <button className="nav-toggle" id="navToggle" aria-expanded={isMenuOpen} aria-controls="navMenu" aria-label="Open menu" onClick={() => setIsMenuOpen(!isMenuOpen)}><i className="fa-solid fa-bars"></i></button>
        <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`} id="navMenu">
          <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/" onClick={closeMenus}>Home</Link>

          <div className={`nav-dropdown ${openDropdown === 'planning' ? 'open' : ''}`}>
            <button type="button" className="nav-link dropdown-toggle" aria-expanded={openDropdown === 'planning'} onClick={() => toggleDropdown('planning')}>Planning <i className="fa-solid fa-caret-down"></i></button>
            <div className="dropdown-menu">
              <a className="nav-link" href="/#basics" onClick={closeMenus}>Basics</a>
              <a className="nav-link" href="/#needs" onClick={closeMenus}>Needs & Wants</a>
              <a className="nav-link" href="/#rule" onClick={closeMenus}>50/30/20</a>
            </div>
          </div>
          <div className={`nav-dropdown ${openDropdown === 'balance' ? 'open' : ''}`}>
            <button type="button" className="nav-link dropdown-toggle" aria-expanded={openDropdown === 'balance'} onClick={() => toggleDropdown('balance')}>Balance <i className="fa-solid fa-caret-down"></i></button>
            <div className="dropdown-menu">
              <a className="nav-link" href="/#saving" onClick={closeMenus}>Savings</a>
              <a className="nav-link" href="/#expenses" onClick={closeMenus}>Expenses</a>
              <a className="nav-link" href="/#mistakes" onClick={closeMenus}>Mistakes</a>
            </div>
          </div>

          <a className="nav-link" href="/#infographics" onClick={closeMenus}>Learn</a>
          <a className="nav-link" href="/#about" onClick={closeMenus}>About Us</a>
          <a className="nav-link" href="/#feedback" onClick={closeMenus}>Feedback</a>
          <a className="nav-link" href="/#contact" onClick={closeMenus}>Contact</a>
          <a className="nav-link" href="/#chatbot" onClick={closeMenus}>AI Chat</a>
          <div className={`nav-search-wrap ${isSearchOpen ? 'open' : ''}`}>
            <button type="button" className="icon-btn nav-search-toggle" id="navSearchToggle" aria-expanded={isSearchOpen} aria-controls="topSearch" aria-label="Toggle search" onClick={toggleSearch}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <div className="nav-search" role="search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input id="topSearch" type="search" placeholder="Search..." aria-label="Search learning content" value={topSearchValue} onChange={e => setTopSearchValue(e.target.value)} onKeyDown={handleTopSearchKeyDown} autoFocus={isSearchOpen} />
            </div>
          </div>
          <Link className="nav-auth" id="navDashboard" to="/dashboard" hidden={!loggedIn}>Dashboard</Link>
          <Link className="nav-auth" id="navLogin" to="/login" hidden={loggedIn}>Login</Link>
          <Link className="nav-auth nav-auth-primary" id="navSignup" to="/signup" hidden={loggedIn}>Sign Up</Link>
          <button className="nav-auth" id="navLogout" type="button" onClick={handleLogout} hidden={!loggedIn}>Logout</button>
          <div className="nav-live" aria-label="Live date and time">
            <span className="live-dot"></span><span id="navLiveTime">{time}</span>
          </div>
          <div className="nav-visitor" title="Local visitor counter"><i className="fa-solid fa-eye"></i><span id="navVisitorCount">{visits}</span></div>
          <div className="nav-user" id="navUser" hidden={!loggedIn}><i className="fa-solid fa-user"></i><span id="navUserName">{userName}</span></div>
          <a className="icon-btn" id="themeToggle" href="#" onClick={toggleTheme} aria-label="Toggle theme" title="Toggle dark/light theme">
            {isLight ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}
          </a>
        </div>
      </nav>
    </header>
  );
}
