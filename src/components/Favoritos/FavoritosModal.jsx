import React from "react";
import { useFavoritos } from "../../context/FavoritosContext";
import { useCart } from "../../context/CartContext";
import "./FavoritosModal.scss";

const WHATSAPP_NUMBER = "5491122531821";

const plata = (n) => `$${Number(n).toLocaleString("es-AR")}`;

const FavoritosModal = () => {
  const { panelAbierto, cerrarPanel, productos, cargando, alternar } =
    useFavoritos();
  const { agregar, setAbierto } = useCart();

  if (!panelAbierto) return null;

  const alAgregar = (producto) => {
    agregar(producto, 1);
    cerrarPanel();
    setAbierto(true);
  };

  const consultarStock = (producto) => {
    const texto = encodeURIComponent(
      `¡Hola Kenypets! 🐾 Vi que *${producto.nombre}* está sin stock. ¿Saben cuándo vuelve?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`, "_blank");
  };

  return (
    <div className="fav-overlay" onClick={cerrarPanel}>
      <div className="fav-panel" onClick={(e) => e.stopPropagation()}>
        <header className="fav-panel__head">
          <h2>Mis favoritos</h2>
          <button className="fav-panel__cerrar" onClick={cerrarPanel}>
            ✕
          </button>
        </header>

        <div className="fav-panel__cuerpo">
          {cargando && productos.length === 0 && (
            <p className="fav-estado">Cargando tus favoritos...</p>
          )}

          {!cargando && productos.length === 0 && (
            <div className="fav-estado">
              <div className="fav-estado__icono">🤍</div>
              <p>
                Todavía no guardaste ninguno. Tocá el corazón de un producto
                para tenerlo a mano.
              </p>
            </div>
          )}

          {productos.map((p) => {
            const sinStock = p.stock <= 0;

            return (
              <div className="fav-item" key={p.id}>
                <img
                  src={`${import.meta.env.BASE_URL}products/${p.imagen}`}
                  alt={p.nombre}
                  loading="lazy"
                />

                <div className="fav-item__info">
                  <strong>{p.nombre}</strong>
                  <span className="fav-item__precio">{plata(p.precio)}</span>
                  {sinStock && <span className="fav-item__agotado">Sin stock</span>}

                  <div className="fav-item__acciones">
                    {sinStock ? (
                      <button
                        className="fav-btn fav-btn--whatsapp"
                        onClick={() => consultarStock(p)}
                      >
                        Consultar
                      </button>
                    ) : (
                      <button
                        className="fav-btn fav-btn--principal"
                        onClick={() => alAgregar(p)}
                      >
                        Agregar al carrito
                      </button>
                    )}

                    <button
                      className="fav-btn fav-btn--quitar"
                      onClick={() => alternar(p)}
                      aria-label={`Quitar ${p.nombre} de favoritos`}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FavoritosModal;
