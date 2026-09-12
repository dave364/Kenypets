import React from "react";
import "./Politicas.scss";

const WHATSAPP_NUMBER = "5491122531821";

// El boton de arrepentimiento es obligatorio para vender online en
// Argentina (Resolucion 424/2020). No puede pedir registro previo,
// asi que es un link directo a WhatsApp, visible para cualquiera.
const linkArrepentimiento = () => {
  const texto = encodeURIComponent(
    "Hola Kenypets, quiero arrepentirme de una compra. Mi numero de pedido es:"
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;
};

const Politicas = () => (
  <section className="politicas" id="politic">
    <div className="politicas__header">
      <small>COMPRA TRANQUILO</small>
      <h2>Politicas de devolucion</h2>
    </div>

    <div className="politicas__grid">
      <article className="politicas__item">
        <span aria-hidden="true">&#8617;</span>
        <h3>Te arrepentiste</h3>
        <p>
          Tenes <strong>10 dias corridos</strong> desde que recibis el producto
          para devolverlo sin dar explicaciones. El costo del envio de vuelta
          corre por nuestra cuenta.
        </p>
      </article>

      <article className="politicas__item">
        <span aria-hidden="true">&#128737;</span>
        <h3>Garantia</h3>
        <p>
          Todos los productos nuevos tienen <strong>6 meses de garantia</strong>{" "}
          por defectos de fabrica. Si algo viene fallado o no es lo que pediste,
          te lo cambiamos o te devolvemos la plata.
        </p>
      </article>

      <article className="politicas__item">
        <span aria-hidden="true">&#128230;</span>
        <h3>En que estado</h3>
        <p>
          El producto tiene que volver sin uso y con su envoltorio original.
          Los alimentos abiertos y los articulos de higiene ya usados no se
          pueden devolver por razones sanitarias.
        </p>
      </article>

      <article className="politicas__item">
        <span aria-hidden="true">&#128172;</span>
        <h3>Como se hace</h3>
        <p>
          Escribinos por WhatsApp con tu numero de pedido. Coordinamos el retiro
          y, una vez que recibimos el producto, hacemos la devolucion del dinero.
        </p>
      </article>
    </div>

    <div className="politicas__arrepentimiento">
      <p>
        Queres cancelar una compra? Es tu derecho y no hace falta que expliques
        nada.
      </p>
      <a
        className="politicas__btn"
        href={linkArrepentimiento()}
        target="_blank"
        rel="noreferrer"
      >
        Boton de arrepentimiento
      </a>
    </div>
  </section>
);

export default Politicas;
