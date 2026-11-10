import React from "react";
import logo from "../../assets/logo/logo.png";
import { WHATSAPP_NUMBER, linkArrepentimiento } from "../../utils/arrepentimiento";
import "./Footer.scss";

// Los links llevan a la portada + la sección, así funcionan también
// desde la página de un producto.
const BASE = import.meta.env.BASE_URL;
const LINKS = [
  { href: `${BASE}#products`, texto: "Productos" },
  { href: `${BASE}#about`, texto: "Quiénes somos" },
  { href: `${BASE}#contact`, texto: "Contacto" },
  { href: `${BASE}#politic`, texto: "Políticas de devolución" },
];

// La "P" de Pixelmate hecha de píxeles, para la firma del pie
const PIXELES = [
  [0, 0], [1, 0], [2, 0], [3, 0],
  [0, 1], [4, 1],
  [0, 2], [4, 2],
  [0, 3], [1, 3], [2, 3], [3, 3],
  [0, 4], [0, 5], [0, 6],
];
const LogoPixelmate = () => (
  <svg viewBox="-2 -12 64 84" width="14" height="18" aria-hidden="true">
    {PIXELES.map(([c, r]) => (
      <rect key={`${c}-${r}`} x={c * 10} y={r * 10} width="8.5" height="8.5" rx="2" fill="currentColor" />
    ))}
    <rect x="50" y="-10" width="8.5" height="8.5" rx="2" fill="#2DD4BF" />
  </svg>
);

const Footer = () => (
  <footer className="footer">
    <div className="footer__contenido">
      <div className="footer__marca">
        <a href={`${BASE}#home`} className="footer__logo" aria-label="Kenypets, volver al inicio">
          <img src={logo} alt="" width="64" height="64" />
          <span>Kenypets</span>
        </a>
        <p>El lugar favorito de tu mascota. Juguetes, accesorios, ropa y snacks elegidos con amor.</p>
      </div>

      <nav className="footer__columna" aria-label="Secciones">
        <h2>Navegá</h2>
        <ul>
          {LINKS.map((l) => (
            <li key={l.texto}>
              <a href={l.href}>{l.texto}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="footer__columna">
        <h2>Hablemos</h2>
        <ul>
          <li>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/kenypets.store/" target="_blank" rel="noopener noreferrer">
              @kenypets.store
            </a>
          </li>
        </ul>
      </div>

      <div className="footer__columna footer__compra">
        <h2>Compra tranquilo</h2>
        <p>Tenés 10 días corridos para arrepentirte de tu compra, sin dar explicaciones.</p>
        <a className="footer__arrepentimiento" href={linkArrepentimiento()} target="_blank" rel="noopener noreferrer">
          Botón de arrepentimiento
        </a>
      </div>
    </div>

    <div className="footer__base">
      <p>© {new Date().getFullYear()} Kenypets. Todos los derechos reservados.</p>
      <a className="footer__pixelmate" href="https://pixelmate.com.ar" target="_blank" rel="noopener">
        Web hecha por <LogoPixelmate /> <strong>Pixelmate</strong>
      </a>
    </div>
  </footer>
);

export default Footer;
