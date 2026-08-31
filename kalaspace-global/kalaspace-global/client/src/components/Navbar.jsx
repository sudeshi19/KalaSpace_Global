import React, { useState } from 'react';
import { Home as HomeIcon, User, Bell, Search, MessageCircle } from 'lucide-react';
import logo from '../assets/kala-logo.jpg';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Sell Art', href: '#sell' },
];

function Navbar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <header className="navbar">
      <a className="navbar__brand" href="#home" aria-label="KalaSpace Global home">
        <img
          className="navbar__brand-logo"
          src={logo}
          alt="KalaSpace Global logo"
        />
        <span className="navbar__brand-text">
          KalaSpace
          <span className="navbar__brand-text-sub">Global</span>
        </span>
      </a>

      <form className="navbar__search" onSubmit={handleSubmit} role="search">
        <input
          type="text"
          placeholder="Search paintings, artists, styles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search artwork"
        />
        <button type="submit" aria-label="Search">
          <Search size={18} />
        </button>
      </form>

      <nav className="navbar__links" aria-label="Primary">
        {NAV_LINKS.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="navbar__icons">
        <a href="#home" aria-label="Home"><HomeIcon size={20} /></a>
        <a href="#profile" aria-label="Profile"><User size={20} /></a>
        <a href="#notifications" aria-label="Notifications"><Bell size={20} /></a>
        <a href="#chat" aria-label="Messages"><MessageCircle size={20} /></a>
      </div>
    </header>
  );
}

export default Navbar;
