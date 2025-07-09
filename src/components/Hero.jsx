import React from "react";
import "../styles/Hero.css";
import dogImg from "../assets/dog-hero.png";

const Hero = () => (
  <section className="hero" id="home">
    <div className="hero__content">
      <div className="hero__text">
        <small>WE HAVE THE BEST PRODUCTS</small>
        <h1>Your Pet’s Favourite Place</h1>
        <p>Todo lo que tus mascotas necesitan, en un solo lugar.</p>
        <a href="#products" className="btn btn--primary">Explore Now</a>
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
          <h3>Get 20% OFF your first order!</h3>
          <p>In consequet, quam id sodales hendrerit, eros mi lacinia risus neque.</p>
        </div>
      </div>
      <a href="#products" className="promo__btn">WOOF WOOF</a>
    </div>
  </section>
);

export default Hero;