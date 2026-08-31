import React, { useState, useEffect } from "react";
import logo from '../../assets/logo/logo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${menuOpen ? "navbar--menu-open" : ""}`}>


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
      <a href="#home"  className="navbar__logo">
        <img src={logo} alt="Kenypets Logo" />
      </a>

      {/* Desktop */}
      <div className="navbar__links">
        <a href="#home">Inicio</a>
        <a href="#products">Productos</a>
        <a href="#about">Quiénes Somos</a>
        <a href="#contact">Contacto</a>
        <a href="#politic">Políticas de devolución</a>
      </div>

      {/* Sidebar */}
    
      <div
        className={`navbar__sidebar ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      >
      {/* ❌ BOTON CERRAR */}
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
          <a onClick={() => setMenuOpen(false)} href="#products">Productos</a>
          <a onClick={() => setMenuOpen(false)} href="#about">Quiénes Somos</a>
          <a onClick={() => setMenuOpen(false)} href="#contact">Contacto</a>
          <a onClick={() => setMenuOpen(false)} href="#politic">Políticas de devolución</a>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
