import React from "react";
import dogImg from "../../assets/Image/dog-hero.png";

const Hero = () => (
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
        <img src={dogImg} alt="Happy dog" />
      </div>
    </div>

    {/* PROMO BANNER */}
    <div className="promo">
      <div className="promo__text">
        <span className="paw">🐾</span>
        <div>
          <h3>¡Obtén un 20% de DESCUENTO en tu primer pedido!</h3>
          <p>Calidad, cuidado y felicidad para tu mascota.</p>
        </div>
      </div>
      <a href="#products" className="promo__btn">WOOF WOOF</a>
    </div>
  </section>
);

export default Hero;
