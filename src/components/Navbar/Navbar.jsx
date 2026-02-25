import React, { useState } from "react";
import logo from '../../assets/logo/logo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      {/* ☰ Hamburguesa izquierda */}
      <div
        className={`navbar__toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* 🐾 Logo derecha */}
      <div className="navbar__logo">
        <img src={logo} alt="Kenypets Logo" />
      </div>

      {/* Desktop */}
      <div className="navbar__links">
        <a href="#home">Inicio</a>
        <a href="#about">Productos</a>
        <a href="#products">Quiénes Somos</a>
        <a href="#contact">Contacto</a>
        <a href="#politic">Políticas de devolución</a>
      </div>

      {/* Sidebar */}
    
      <div
        className={`navbar__sidebar ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      >
          <button
    className="navbar__close"
    onClick={(e) => {
      e.stopPropagation();
      setMenuOpen(false);
    }}
  >
    ✕
  </button>
        <div
          className="navbar__sidebar-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sidebar__logo">
            <img src={logo} alt="Kenypets Logo" />
          </div>

          <a onClick={() => setMenuOpen(false)} href="#home">Inicio</a>
          <a onClick={() => setMenuOpen(false)} href="#about">Productos</a>
          <a onClick={() => setMenuOpen(false)} href="#products">Quiénes Somos</a>
          <a onClick={() => setMenuOpen(false)} href="#contact">Contacto</a>
          <a onClick={() => setMenuOpen(false)} href="#politic">Políticas de devolución</a>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
