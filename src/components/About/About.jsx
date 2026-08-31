import React from "react";
import "./About.scss";

const values = [
  {
    emoji: "💜",
    title: "Creada con amor",
    desc: "Cada producto lo elegimos pensando en mimar a tu mascota como se merece.",
  },
  {
    emoji: "🎀",
    title: "Kits personalizados",
    desc: "Armamos kits únicos pensados especialmente para tu compañero peludo.",
  },
  {
    emoji: "📍",
    title: "Punto de encuentro",
    desc: "Somos ese lugar donde los amantes de las mascotas se encuentran y conectan.",
  },
  {
    emoji: "💬",
    title: "Atención por WhatsApp",
    desc: "Te asesoramos en cada compra. Estamos siempre disponibles para ayudarte.",
  },
];

const About = () => (
  <section className="about" id="about">
    {/* HISTORIA */}
    <div className="about__story">

      {/* Polaroids */}
      <div className="about__story-img">
        <div className="about__polaroid about__polaroid--left">
          <div className="about__polaroid-img">🐱</div>
          <span>Kenobi <em>(El Jefe)</em></span>
        </div>
        <div className="about__polaroid about__polaroid--right">
          <div className="about__polaroid-img about__polaroid-img--yose">👩‍🦰</div>
          <span>Yoselin</span>
        </div>
      </div>

      <div className="about__story-text">
        <small>¿QUIÉNES SOMOS?</small>
        <h2>Un espacio de Mimos y Amor</h2>
        <p>
          Soy Yose, y junto con mi lindo (y demandante) gatito Kenobi,
          le damos vida a este espacio llamado <strong>KenyPets</strong>.
        </p>
        <p>
          Nació de nuestro amor por esos compañeros peluditos que nos aman
          sin importar nada en el mundo. Para ellos, solo existimos
          nosotros… y para nosotros, ellos lo son todo. 🐾
        </p>

        <a
          className="about__ig-btn"
          href="https://www.instagram.com/kenypets.store/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Seguinos en Instagram
        </a>

        <div className="about__stat-row">
          <div className="about__stat">
            <span className="about__stat-num">35+</span>
            <span className="about__stat-label">Publicaciones</span>
          </div>
          <div className="about__stat">
            <span className="about__stat-num">100%</span>
            <span className="about__stat-label">Con amor</span>
          </div>
          <div className="about__stat">
            <span className="about__stat-num">🐱🐶</span>
            <span className="about__stat-label">Para todos</span>
          </div>
        </div>
      </div>
    </div>

    {/* POR QUÉ ELEGIRNOS */}
    <div className="about__values">
      <div className="about__values-header">
        <small>POR QUÉ ELEGIRNOS</small>
        <h2>Lo que nos hace diferentes</h2>
      </div>
      <div className="about__values-grid">
        {values.map((v) => (
          <div className="about__value-card" key={v.title}>
            <span className="about__value-emoji">{v.emoji}</span>
            <h3>{v.title}</h3>
            <p>{v.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default About;