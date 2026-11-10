import React from "react";
import "./Politicas.scss";

const Politicas = () => (
  <section className="politicas" id="politic">
    <div className="politicas__header">
      <small>COMPRA TRANQUILO</small>
      <h2>Políticas de devolución</h2>
    </div>

    <div className="politicas__grid">
      <article className="politicas__item">
        <span aria-hidden="true">&#8617;</span>
        <h3>¿Te arrepentiste?</h3>
        <p>
          Tenés <strong>10 días corridos</strong> desde que recibís el producto
          para devolverlo sin dar explicaciones. El costo del envío de vuelta
          corre por nuestra cuenta.
        </p>
      </article>

      <article className="politicas__item">
        <span aria-hidden="true">&#128737;</span>
        <h3>Garantía</h3>
        <p>
          Todos los productos nuevos tienen <strong>6 meses de garantía</strong>{" "}
          por defectos de fábrica. Si algo viene fallado o no es lo que pediste,
          te lo cambiamos o te devolvemos la plata.
        </p>
      </article>

      <article className="politicas__item">
        <span aria-hidden="true">&#128230;</span>
        <h3>¿En qué estado?</h3>
        <p>
          El producto tiene que volver sin uso y con su envoltorio original.
          Los alimentos abiertos y los artículos de higiene ya usados no se
          pueden devolver por razones sanitarias.
        </p>
      </article>

      <article className="politicas__item">
        <span aria-hidden="true">&#128172;</span>
        <h3>¿Cómo se hace?</h3>
        <p>
          Escribinos por WhatsApp con tu número de pedido. Coordinamos el retiro
          y, una vez que recibimos el producto, hacemos la devolución del dinero.
        </p>
      </article>
    </div>

    <p className="politicas__nota">
      ¿Querés cancelar una compra? Usá el <strong>Botón de arrepentimiento</strong> al pie de la página.
    </p>
  </section>
);

export default Politicas;
