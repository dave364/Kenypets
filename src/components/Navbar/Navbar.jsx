import React, { useState, useEffect, useRef } from "react";
import logo from '../../assets/logo/logo.png';
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuCuenta, setMenuCuenta] = useState(false);
  const cuentaRef = useRef(null);

  const { logueado, usuario, tieneDescuento, abrirModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cierra el menu de la cuenta al hacer clic afuera
  useEffect(() => {
    if (!menuCuenta) return;
    const alClickear = (e) => {
      if (cuentaRef.current && !cuentaRef.current.contains(e.target)) {
        setMenuCuenta(false);
      }
    };
    document.addEventListener("mousedown", alClickear);
    return () => document.removeEventListener("mousedown", alClickear);
  }, [menuCuenta]);

  const primerNombre = (usuario?.nombre || "").split(" ")[0] || "Mi cuenta";

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

      {/* Cuenta: registro o sesion iniciada */}
      <div className="navbar__cuenta">
        {!logueado ? (
          <>
            <button
              className="navbar__cuenta-btn navbar__cuenta-btn--ghost"
              onClick={() => abrirModal("login")}
            >
              Entrar
            </button>
            <button
              className="navbar__cuenta-btn"
              onClick={() => abrirModal("registro")}
            >
              Registrate
            </button>
          </>
        ) : (
          <div className="navbar__usuario" ref={cuentaRef}>
            <button
              className="navbar__usuario-btn"
              onClick={() => setMenuCuenta((v) => !v)}
            >
              <span aria-hidden="true">🐾</span>
              <span className="navbar__usuario-nombre">{primerNombre}</span>
            </button>

            {menuCuenta && (
              <div className="navbar__usuario-menu">
                <p>
                  {usuario?.email}
                  {tieneDescuento && (
                    <span className="navbar__usuario-badge">
                      20% en tu primer pedido
                    </span>
                  )}
                </p>
                <button
                  onClick={() => {
                    setMenuCuenta(false);
                    logout();
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
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
