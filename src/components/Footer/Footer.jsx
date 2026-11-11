import React from "react";
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

// Íconos dibujados, con el mismo trazo, para que las redes no queden
// como texto suelto.
const IconoWhatsapp = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
    <path
      d="M12 2.4A9.6 9.6 0 0 0 3.7 16.9L2.6 21.4l4.6-1.1A9.6 9.6 0 1 0 12 2.4zm0 1.9a7.7 7.7 0 1 1-4 14.3l-.3-.2-2.4.6.6-2.3-.2-.3A7.7 7.7 0 0 1 12 4.3z"
      fill="currentColor"
    />
    <path
      d="M9.3 7.6c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.6.7 3 .6.5 0 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.2l-.5-.3-1.6-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.2-.1-1-.4-2-1.2-.7-.7-1.2-1.5-1.4-1.7-.1-.2 0-.4.1-.5l.4-.4.3-.5v-.5l-.7-1.9z"
      fill="currentColor"
    />
  </svg>
);

const IconoInstagram = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.9" />
    <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.9" />
    <circle cx="17.2" cy="6.8" r="1.25" fill="currentColor" />
  </svg>
);

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
    <div className="footer__tira">
      <nav aria-label="Secciones">
        {LINKS.map((l) => (
          <a key={l.texto} href={l.href}>
            {l.texto}
          </a>
        ))}
      </nav>
      <div className="footer__redes">
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
          <IconoWhatsapp />
          WhatsApp
        </a>
        <a href="https://www.instagram.com/kenypets.store/" target="_blank" rel="noopener noreferrer">
          <IconoInstagram />
          @kenypets.store
        </a>
      </div>
    </div>

    <div className="footer__barra">
      <p>
        <strong>Compra tranquilo</strong>
        Tenés 10 días corridos para arrepentirte de tu compra, sin dar explicaciones.
      </p>
      <a
        className="footer__arrepentimiento"
        href={linkArrepentimiento()}
        target="_blank"
        rel="noopener noreferrer"
      >
        Botón de arrepentimiento
      </a>
    </div>

    <div className="footer__pie">
      <p>© {new Date().getFullYear()} Kenypets. Todos los derechos reservados.</p>
      <a className="footer__pixelmate" href="https://pixelmate.com.ar" target="_blank" rel="noopener">
        Web hecha por <LogoPixelmate /> <strong>Pixelmate</strong>
      </a>
    </div>

    {/* El nombre cierra el sitio como una firma; sigue llevando al inicio. */}
    <div className="footer__cierre">
      <p className="footer__lema">
        El lugar favorito de tu mascota. Juguetes, accesorios, ropa y snacks elegidos con amor.
      </p>
      <a className="footer__firma" href={`${BASE}#home`} aria-label="Kenypets, volver al inicio">
        Kenypets
      </a>
    </div>
  </footer>
);

export default Footer;
