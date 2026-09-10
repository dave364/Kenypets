import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import "./Cart.scss";

const API_URL = import.meta.env.VITE_API_URL || "https://kenypets-api.onrender.com";
const WHATSAPP_NUMBER = "5491122531821";

const plata = (n) => `$${Number(n).toLocaleString("es-AR")}`;

const Cart = () => {
  const {
    items,
    cambiarCantidad,
    quitar,
    vaciar,
    unidades,
    subtotal,
    abierto,
    setAbierto,
  } = useCart();

  const [paso, setPaso] = useState("carrito"); // carrito | datos | listo
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [pedido, setPedido] = useState(null);

  const cerrar = () => {
    setAbierto(false);
    // Si ya termino, al cerrar volvemos al estado inicial
    if (paso === "listo") {
      setPaso("carrito");
      setPedido(null);
      setNombre("");
      setTelefono("");
    }
  };

  // Normaliza a formato internacional argentino para WhatsApp.
  // "11 2345 6789" y "+54 9 11 2345 6789" terminan igual: 5491123456789.
  const soloDigitos = (t) => {
    let d = t.replace(/\D/g, "");
    if (d.startsWith("54")) d = d.slice(2);
    if (d.startsWith("9")) d = d.slice(1);
    if (d.startsWith("0")) d = d.slice(1);
    // Los celulares argentinos se escriben con un 15 antes del numero local
    if (d.length > 10 && d.slice(2, 4) === "15") d = d.slice(0, 2) + d.slice(4);
    return "549" + d;
  };

  const confirmar = async () => {
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_nombre: nombre.trim(),
          cliente_telefono: soloDigitos(telefono),
          // Mandamos solo id y cantidad. El precio lo calcula el servidor.
          items: items.map((i) => ({ producto_id: i.id, cantidad: i.cantidad })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No pudimos registrar el pedido.");
      }
      setPedido(data);
      setPaso("listo");
      vaciar();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const avisarPorWhatsApp = () => {
    const lineas = (pedido.items || []).map(
      (i) => `• ${i.cantidad} × ${i.nombre || `Producto ${i.producto_id}`}`
    );
    const texto = encodeURIComponent(
      `¡Hola Kenypets! 🐾 Acabo de hacer el pedido *#${pedido.numero ?? pedido.id}*.\n\n` +
        `${lineas.join("\n")}\n\n` +
        `Total: ${plata(pedido.total)}\n` +
        `A nombre de: ${pedido.cliente_nombre ?? nombre}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`, "_blank");
  };

  const telefonoValido = telefono.replace(/\D/g, "").length >= 8;
  const nombreValido = nombre.trim().length >= 2;

  return (
    <>
      {/* BOTON FLOTANTE */}
      {unidades > 0 && !abierto && (
        <button
          className="cart-fab"
          onClick={() => setAbierto(true)}
          aria-label={`Abrir carrito, ${unidades} productos`}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
          <span className="cart-fab__contador">{unidades}</span>
        </button>
      )}

      {/* PANEL */}
      {abierto && (
        <div className="cart-overlay" onClick={cerrar}>
          <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
            <header className="cart-panel__head">
              <h2>
                {paso === "carrito" && "Tu carrito"}
                {paso === "datos" && "Tus datos"}
                {paso === "listo" && "¡Pedido registrado!"}
              </h2>
              <button className="cart-panel__cerrar" onClick={cerrar}>
                ✕
              </button>
            </header>

            {/* --- PASO 1: ITEMS --- */}
            {paso === "carrito" && (
              <>
                <div className="cart-panel__cuerpo">
                  {items.length === 0 && (
                    <p className="cart-vacio">
                      Todavía no agregaste nada. 🐾
                    </p>
                  )}

                  {items.map((i) => (
                    <div className="cart-item" key={i.id}>
                      <img
                        src={`${import.meta.env.BASE_URL}products/${i.imagen}`}
                        alt={i.nombre}
                        loading="lazy"
                      />
                      <div className="cart-item__info">
                        <strong>{i.nombre}</strong>
                        <span className="cart-item__precio">
                          {plata(i.precio)}
                        </span>
                        <div className="cart-item__cantidad">
                          <button
                            onClick={() => cambiarCantidad(i.id, i.cantidad - 1)}
                            aria-label="Quitar uno"
                          >
                            −
                          </button>
                          <span>{i.cantidad}</span>
                          <button
                            onClick={() => cambiarCantidad(i.id, i.cantidad + 1)}
                            disabled={i.cantidad >= i.stock}
                            aria-label="Agregar uno"
                          >
                            +
                          </button>
                          {i.cantidad >= i.stock && (
                            <small>máximo disponible</small>
                          )}
                        </div>
                      </div>
                      <button
                        className="cart-item__quitar"
                        onClick={() => quitar(i.id)}
                        aria-label={`Quitar ${i.nombre}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {items.length > 0 && (
                  <footer className="cart-panel__pie">
                    <div className="cart-total">
                      <span>Subtotal</span>
                      <strong>{plata(subtotal)}</strong>
                    </div>
                    <p className="cart-nota">
                      El total final lo confirma Kenypets al procesar el pedido.
                    </p>
                    <button
                      className="cart-btn cart-btn--principal"
                      onClick={() => setPaso("datos")}
                    >
                      Continuar
                    </button>
                  </footer>
                )}
              </>
            )}

            {/* --- PASO 2: DATOS --- */}
            {paso === "datos" && (
              <>
                <div className="cart-panel__cuerpo">
                  <label className="cart-campo">
                    Nombre y apellido
                    <input
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ana Pérez"
                      autoComplete="name"
                    />
                  </label>

                  <label className="cart-campo">
                    WhatsApp
                    <input
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="11 2345 6789"
                      inputMode="numeric"
                      autoComplete="tel"
                    />
                    <small>
                      Te escribimos por acá para coordinar pago y entrega.
                    </small>
                  </label>

                  <div className="cart-resumen">
                    {items.map((i) => (
                      <div key={i.id}>
                        <span>
                          {i.cantidad} × {i.nombre}
                        </span>
                        <span>{plata(i.precio * i.cantidad)}</span>
                      </div>
                    ))}
                  </div>

                  {error && <p className="cart-error">{error}</p>}
                </div>

                <footer className="cart-panel__pie">
                  <div className="cart-total">
                    <span>Subtotal</span>
                    <strong>{plata(subtotal)}</strong>
                  </div>
                  <div className="cart-acciones">
                    <button
                      className="cart-btn"
                      onClick={() => setPaso("carrito")}
                    >
                      Volver
                    </button>
                    <button
                      className="cart-btn cart-btn--principal"
                      onClick={confirmar}
                      disabled={enviando || !nombreValido || !telefonoValido}
                    >
                      {enviando ? "Enviando..." : "Confirmar pedido"}
                    </button>
                  </div>
                </footer>
              </>
            )}

            {/* --- PASO 3: LISTO --- */}
            {paso === "listo" && pedido && (
              <div className="cart-panel__cuerpo cart-listo">
                <div className="cart-listo__icono">🎉</div>
                <p>
                  Tu pedido quedó registrado con el número{" "}
                  <strong>#{pedido.numero ?? pedido.id}</strong>.
                </p>
                <p className="cart-listo__total">
                  Total: <strong>{plata(pedido.total)}</strong>
                </p>
                <p className="cart-nota">
                  Guardá ese número. Te vamos a escribir por WhatsApp para
                  coordinar el pago y la entrega.
                </p>

                <button
                  className="cart-btn cart-btn--whatsapp"
                  onClick={avisarPorWhatsApp}
                >
                  Avisarnos por WhatsApp
                </button>
                <button className="cart-btn" onClick={cerrar}>
                  Seguir comprando
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
