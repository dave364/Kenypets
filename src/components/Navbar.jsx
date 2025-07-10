import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
  <div className="navbar__logo">
    <img src={logo} alt="Kenypets Logo" />
  </div>

  {/* Enlaces visibles en escritorio */}
  <div className="navbar__links">
    <a href="#home">Inicio</a>
    <a href="#about">Productos</a>
    <a href="#products">Quiénes Somos</a>
    <a href="#contact">Contacto</a>
    <a href="#politic">Políticas de devolución</a>
  </div>

      {/* Sidebar (menú lateral para mobile) */}
<div
  className={`navbar__sidebar ${menuOpen ? "open" : ""}`}
  onClick={() => setMenuOpen(false)}
>
  <div
    className="navbar__sidebar-content"
    onClick={(e) => e.stopPropagation()}>
        <div className="sidebar__logo">
    <img src={logo} alt="Kenypets Logo" />
  </div>
    <a href="#home" onClick={() => setMenuOpen(false)}>Inicio</a>
    <a href="#about" onClick={() => setMenuOpen(false)}>Productos</a>
    <a href="#products" onClick={() => setMenuOpen(false)}>Quiénes Somos</a>
    <a href="#contact" onClick={() => setMenuOpen(false)}>Contacto</a>
    <a href="#politic" onClick={() => setMenuOpen(false)}>Políticas de devolución</a>
  </div>
</div>

      {/* Toggle hamburguesa */}
      <div
        className={`navbar__toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;
