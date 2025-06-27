// client/src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; 
import './Navbar.css';

// Terima userInfo dan setUserInfo sebagai props
function Navbar({ userInfo, setUserInfo }) {
  const navigate = useNavigate(); 
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      document.body.classList.add('dark-mode');
      setDarkMode(true);
    }
  }, []);

  // Scroll ke contact jika ada hash #contact di url
  useEffect(() => {
    if (window.location.hash === '#contact') {
      setTimeout(() => {
        const contactSection = document.querySelector('[ref-contact-section]') || document.getElementById('contact-section');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 400);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo'); 
    setUserInfo(null);
    navigate('/login'); 
    window.location.reload(); 
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
      }
      return next;
    });
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (window.location.pathname === '/') {
      const contactSection = document.querySelector('[ref-contact-section]') || document.getElementById('contact-section');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/#contact');
    }
  };

  // Sidebar menu list
  const menuLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/menu', label: 'Menu' },
    { to: '/subscription', label: 'Langganan' },
    { to: '#contact', label: 'Kontak', isAnchor: true },
  ];
  if (userInfo) {
    if (userInfo.role === 'admin') menuLinks.push({ to: '/admin-dashboard', label: 'Admin Dashboard' });
    else menuLinks.push({ to: '/dashboard', label: 'Dashboard' });
  } else {
    menuLinks.push({ to: '/register', label: 'Register' });
    menuLinks.push({ to: '/login', label: 'Login' });
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">SEA Catering</NavLink>
      </div>
      {/* Hamburger icon for mobile */}
      <button className="navbar-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
        <i className="fa-solid fa-bars"></i>
      </button>
      {/* Sidebar overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      {/* Sidebar drawer */}
      <aside className={`sidebar-drawer${sidebarOpen ? ' open' : ''}`}>
        <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <ul className="sidebar-links">
          {menuLinks.map((link, idx) => (
            <li key={idx}>
              {link.isAnchor ? (
                <a href={link.to} onClick={(e) => { setSidebarOpen(false); handleContactClick(e); }}>{link.label}</a>
              ) : (
                <NavLink to={link.to} onClick={() => setSidebarOpen(false)}>{link.label}</NavLink>
              )}
            </li>
          ))}
          {userInfo && (
            <li>
              <button onClick={handleLogout} className="logout-button" style={{width: '100%'}}>Logout</button>
            </li>
          )}
        </ul>
        <div style={{marginTop: 24, textAlign: 'center'}}>
          <button
            onClick={toggleDarkMode}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 22,
              color: darkMode ? '#FF9800' : '#FF9800',
              transition: 'color 0.2s',
            }}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
            aria-label="Toggle dark mode"
          >
            <i className={darkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
          </button>
        </div>
      </aside>
      {/* Desktop menu */}
      <ul className="navbar-links">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Beranda
          </NavLink>
        </li>
        <li>
          <NavLink to="/menu" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Menu
          </NavLink>
        </li>
        <li>
          <NavLink to="/subscription" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Langganan
          </NavLink>
        </li>
        <li>
          <a href="#contact" onClick={handleContactClick} className="navbar-link">
            Kontak
          </a>
        </li>
        {/* Tampilkan link Register/Login atau Logout berdasarkan status login */}
        {userInfo ? (
          <>
            {userInfo.role === 'admin' ? (
              <li>
                <NavLink to="/admin-dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                  Admin Dashboard
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                  Dashboard
                </NavLink>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/register" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                Register
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'active-link' : '')}>
                Login
              </NavLink>
            </li>
          </>
        )}
        <li>
          <button
            onClick={toggleDarkMode}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 22,
              marginLeft: 18,
              color: darkMode ? '#FF9800' : '#FF9800',
              transition: 'color 0.2s',
            }}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
            aria-label="Toggle dark mode"
          >
            <i className={darkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;