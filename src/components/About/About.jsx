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
          <div className="about__polaroid-img">
            <img
              src={`${import.meta.env.BASE_URL}kenobi.jpg`}
              alt="Kenobi, el gato de Kenypets"
              loading="lazy"
            />
          </div>
          <span>Kenobi <em>(El Jefe)</em></span>
        </div>
        <div className="about__polaroid about__polaroid--right">
          <div className="about__polaroid-img about__polaroid-img--yose">
            <img
              src={`${import.meta.env.BASE_URL}yoselin.jpg`}
              alt="Yoselin, fundadora de Kenypets"
              loading="lazy"
            />
          </div>
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

    {/* CONTACTO */}
    <div className="about__contacto" id="contact">
      <small>HABLEMOS</small>
      <h2>Estamos a un mensaje</h2>
      <p>
        Escribinos para consultar stock, coordinar un pedido o pedir una
        recomendacion para tu companiero. Te respondemos por donde te quede
        mas comodo.
      </p>

      <div className="about__contacto-botones">
        <a
          className="about__contacto-btn about__contacto-btn--wsp"
          href="https://wa.me/5491122531821"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Escribinos por WhatsApp
        </a>

        <a
          className="about__contacto-btn about__contacto-btn--ig"
          href="https://www.instagram.com/kenypets.store/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Seguinos en Instagram
        </a>
      </div>
    </div>
  </section>
);

export default About;
