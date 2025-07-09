import React from "react";
import logo from "../assets/logo.jpeg";
import "../styles/Navbar.css";

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar__logoArea">
      <img src={logo} alt="Kenypets logo" />
      <span className="navbar__brand">KENYPETS</span>
    </div>
    <ul className="navbar__menu">
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#products">Products</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
);

export default Navbar;