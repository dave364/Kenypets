import React from "react";
import { useAuth } from "../../context/AuthContext";
import dogImg from "../../assets/Image/dog-hero.webp";
import dogImgSmall from "../../assets/Image/dog-hero-560w.webp";

const Hero = () => {
  const { logueado, abrirModal } = useAuth();

  return (
  <section className="hero" id="home">
    <div className="hero__content">
      <div className="hero__text">
        <small>NOSOTROS TENEMOS LOS MEJORES PRODUCTOS</small>
        <h1>El lugar favorito de tu mascota</h1>
        <p>Todo lo que tus mascotas necesitan, en un solo lugar.</p>
        <a href="#products" className="btn btn--primary">
Explora ahora</a>
      </div>
      <div className="hero__img">
        <img
          src={dogImg}
          srcSet={dogImgSmall + " 560w, " + dogImg + " 840w"}
          sizes="(max-width: 900px) 280px, 420px"
          width="840"
          height="756"
          alt="Perro y gato felices"
        />
      </div>
    </div>

    {/* PROMO BANNER */}
    <div className="promo">
      <div className="promo__text">
        <span className="paw">&#128062;</span>
        <div>
          <h3>Registrate en Kenypets y obtene un 20% de DESCUENTO en tu primer pedido!</h3>
          <p>Calidad, cuidado y felicidad para tu mascota.</p>
        </div>
      </div>
      {/* El banner promete un descuento por registrarse: el boton
          tiene que llevar justamente ahi. Si ya tiene cuenta, no
          tiene sentido ofrecerle registrarse otra vez. */}
      {!logueado ? (
        <button className="promo__btn" onClick={() => abrirModal("registro")}>
          WOOF WOOF
        </button>
      ) : (
        <a href="#products" className="promo__btn">VER PRODUCTOS</a>
      )}
    </div>
  </section>
  );
};

export default Hero;
