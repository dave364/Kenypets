import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import { useFavoritos } from "../../context/FavoritosContext";
import { urlImagen, fotosDe } from "../../utils/imagen";
import { urlProducto, urlProductoAbsoluta, alClickLink } from "../../utils/rutas";
import "./ProductoDetalle.scss";

const WHATSAPP_NUMBER = "5491122531821";
const API_URL = import.meta.env.VITE_API_URL || "https://kenypets-api.onrender.com";
const BASE = import.meta.env.BASE_URL;
const TITULO_TIENDA = "KenyPets";

const plata = (n) => `$${Number(n).toLocaleString("es-AR")}`;

// Foto grande con miniaturas. En el celular se pasa deslizando el dedo.
const Galeria = ({ fotos, nombre, children }) => {
  const [actual, setActual] = useState(0);
  const toque = useRef(null);
  const total = fotos.length;

  const ir = (i) => setActual((i + total) % total);

  const alTocar = (e) => {
    toque.current = e.touches[0].clientX;
  };
  const alSoltar = (e) => {
    if (toque.current == null || total < 2) return;
    const dx = e.changedTouches[0].clientX - toque.current;
    toque.current = null;
    if (Math.abs(dx) > 40) ir(actual + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="galeria">
      <div className="detalle__foto" onTouchStart={alTocar} onTouchEnd={alSoltar}>
        {children}
        <img
          src={urlImagen(fotos[actual], 1000)}
          alt={total > 1 ? `${nombre} (foto ${actual + 1} de ${total})` : nombre}
        />
        {total > 1 && (
          <>
            <button
              type="button"
              className="galeria__flecha galeria__flecha--izq"
              onClick={() => ir(actual - 1)}
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="galeria__flecha galeria__flecha--der"
              onClick={() => ir(actual + 1)}
              aria-label="Foto siguiente"
            >
              ›
            </button>
            <span className="galeria__contador">
              {actual + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="galeria__miniaturas">
          {fotos.map((foto, i) => (
            <button
              type="button"
              key={foto + i}
              className={`galeria__mini ${i === actual ? "activa" : ""}`}
              onClick={() => setActual(i)}
              aria-label={`Ver foto ${i + 1}`}
            >
              <img src={urlImagen(foto, 160)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductoDetalle = ({ id }) => {
  const { agregar, setAbierto } = useCart();
  const { esFavorito, alternar } = useFavoritos();
  const [producto, setProducto] = useState(null);
  const [estado, setEstado] = useState("cargando"); // cargando | listo | no-existe | error
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    let vigente = true;
    setEstado("cargando");
    window.scrollTo(0, 0);

    fetch(`${API_URL}/api/productos/${id}`)
      .then(async (res) => {
        if (!vigente) return;
        if (res.status === 404) return setEstado("no-existe");
        if (!res.ok) throw new Error(`Error ${res.status}`);
        setProducto(await res.json());
        setEstado("listo");
      })
      .catch(() => vigente && setEstado("error"));

    return () => {
      vigente = false;
    };
  }, [id]);

  // Titulo de la pestana con el nombre del producto, y si el link quedo
  // con un nombre viejo, lo corrige sin recargar.
  useEffect(() => {
    if (!producto) return;
    document.title = `${producto.nombre} | ${TITULO_TIENDA}`;
    const correcta = urlProducto(producto);
    if (window.location.pathname !== correcta) {
      window.history.replaceState({}, "", correcta + window.location.search);
    }
    return () => {
      document.title = TITULO_TIENDA;
    };
  }, [producto]);

  if (estado === "cargando") {
    return (
      <main className="detalle detalle--estado">
        <p>Cargando producto...</p>
      </main>
    );
  }

  if (estado !== "listo") {
    return (
      <main className="detalle detalle--estado">
        <div className="detalle__aviso">🐾</div>
        <p>
          {estado === "no-existe"
            ? "Este producto ya no está disponible."
            : "No pudimos cargar el producto. Probá de nuevo en un ratito."}
        </p>
        <a className="detalle__btn detalle__btn--principal" href={`${BASE}#products`}>
          Ver todos los productos
        </a>
      </main>
    );
  }

  const sinStock = producto.stock <= 0;
  const favorito = esFavorito(producto.id);
  const fotos = fotosDe(producto).length ? fotosDe(producto) : [null];

  const alAgregar = () => {
    agregar(producto, 1);
    setAbierto(true);
  };

  const consultar = () => {
    const texto = encodeURIComponent(
      sinStock
        ? `¡Hola Kenypets! 🐾 Vi que *${producto.nombre}* está sin stock. ¿Saben cuándo vuelve?\n\n${urlProductoAbsoluta(producto)}`
        : `¡Hola Kenypets! 🐾 Tengo una consulta sobre *${producto.nombre}* (${plata(producto.precio)}).\n\n${urlProductoAbsoluta(producto)}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`, "_blank");
  };

  // En el celular abre el menu de compartir del telefono (WhatsApp,
  // Instagram, etc.). En la compu copia el link.
  const compartir = async () => {
    const url = urlProductoAbsoluta(producto);
    if (navigator.share) {
      try {
        await navigator.share({ title: producto.nombre, text: `Mirá esto en Kenypets 🐾`, url });
        return;
      } catch (err) {
        if (err?.name === "AbortError") return; // cerro el menu sin compartir
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      window.prompt("Copiá el link:", url);
    }
  };

  return (
    <main className="detalle">
      <a className="detalle__volver" href={`${BASE}#products`} onClick={alClickLink(`${BASE}#products`)}>
        ← Volver a la tienda
      </a>

      <div className="detalle__grid">
        <Galeria key={producto.id} fotos={fotos} nombre={producto.nombre}>
          {producto.badge && !sinStock && (
            <span className="detalle__badge">{producto.badge}</span>
          )}
          {sinStock && <span className="detalle__badge detalle__badge--agotado">Agotado</span>}
        </Galeria>

        <div className="detalle__info">
          <span className="detalle__categoria">{producto.categoria}</span>
          <h1 className="detalle__nombre">{producto.nombre}</h1>
          <p className="detalle__precio">{plata(producto.precio)}</p>

          <p className={`detalle__stock ${sinStock ? "detalle__stock--sin" : ""}`}>
            {sinStock
              ? "Sin stock por ahora"
              : producto.stock <= 3
              ? `¡Quedan solo ${producto.stock}!`
              : "Disponible"}
          </p>

          <div className="detalle__acciones">
            {sinStock ? (
              <button className="detalle__btn detalle__btn--wsp" onClick={consultar}>
                Avisame cuando vuelva
              </button>
            ) : (
              <button className="detalle__btn detalle__btn--principal" onClick={alAgregar}>
                Agregar al carrito
              </button>
            )}

            <div className="detalle__secundarias">
              <button
                className={`detalle__btn-icono ${favorito ? "activo" : ""}`}
                onClick={() => alternar(producto)}
                aria-label={favorito ? "Quitar de favoritos" : "Guardar en favoritos"}
                title={favorito ? "Quitar de favoritos" : "Guardar en favoritos"}
              >
                {favorito ? "❤️" : "🤍"}
              </button>
              {!sinStock && (
                <button className="detalle__btn detalle__btn--borde" onClick={consultar}>
                  Consultar
                </button>
              )}
              <button className="detalle__btn detalle__btn--borde" onClick={compartir}>
                {copiado ? "¡Link copiado!" : "Compartir"}
              </button>
            </div>
          </div>

          {producto.descripcion && (
            <div className="detalle__descripcion">
              <h2>Descripción</h2>
              <p>{producto.descripcion}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductoDetalle;
