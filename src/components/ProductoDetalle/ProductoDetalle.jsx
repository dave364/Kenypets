import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useFavoritos } from "../../context/FavoritosContext";
import { urlImagen } from "../../utils/imagen";
import { urlProducto, urlProductoAbsoluta, alClickLink } from "../../utils/rutas";
import "./ProductoDetalle.scss";

const WHATSAPP_NUMBER = "5491122531821";
const API_URL = import.meta.env.VITE_API_URL || "https://kenypets-api.onrender.com";
const BASE = import.meta.env.BASE_URL;
const TITULO_TIENDA = "KenyPets";

const plata = (n) => `$${Number(n).toLocaleString("es-AR")}`;

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
        <div className="detalle__foto">
          {producto.badge && !sinStock && (
            <span className="detalle__badge">{producto.badge}</span>
          )}
          {sinStock && <span className="detalle__badge detalle__badge--agotado">Agotado</span>}
          <img src={urlImagen(producto.imagen, 1000)} alt={producto.nombre} />
        </div>

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
