import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useFavoritos } from "../../context/FavoritosContext";
import { urlImagen } from "../../utils/imagen";
import { urlProducto, urlProductoAbsoluta, alClickLink } from "../../utils/rutas";
import "./Products.scss";

const WHATSAPP_NUMBER = "5491122531821";

// La URL de la API. En desarrollo podes apuntarla a tu backend local
// creando un archivo .env con VITE_API_URL=http://localhost:3000
const API_URL = import.meta.env.VITE_API_URL || "https://kenypets-api.onrender.com";


const sinAcentos = (t = "") =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const Products = () => {
  const { agregar, setAbierto } = useCart();
  const { esFavorito, alternar, cantidad } = useFavoritos();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  // Productos con la descripcion desplegada ("Ver mas")
  const [abiertas, setAbiertas] = useState(() => new Set());

  const alternarDescripcion = (id) =>
    setAbiertas((prev) => {
      const nuevo = new Set(prev);
      if (nuevo.has(id)) nuevo.delete(id);
      else nuevo.add(id);
      return nuevo;
    });

  useEffect(() => {
    // Si el componente se desmonta antes de que responda la API,
    // este flag evita actualizar el estado de algo que ya no existe.
    let vigente = true;

    const traerProductos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/productos`);
        if (!res.ok) throw new Error(`El servidor respondio ${res.status}`);
        const data = await res.json();
        if (vigente) {
          setProductos(data);
          setError(null);
        }
      } catch (err) {
        if (vigente) setError(err.message);
      } finally {
        if (vigente) setCargando(false);
      }
    };

    traerProductos();
    return () => {
      vigente = false;
    };
  }, []);

  // Las categorias salen de los productos que llegaron, no de una lista fija:
  // si mañana agregas "Alimentos" en la base, el filtro aparece solo.
  const categorias = [
    "Todos",
    ...new Set(productos.map((p) => p.categoria)),
    // El chip de favoritos solo aparece si hay alguno marcado
    ...(cantidad > 0 ? ["Favoritos"] : []),
  ];

  const porCategoria =
    activeFilter === "Todos"
      ? productos
      : activeFilter === "Favoritos"
      ? productos.filter((p) => esFavorito(p.id))
      : productos.filter((p) => p.categoria === activeFilter);

  // Busca cada palabra en nombre, categoria, badge y descripcion, sin
  // importar acentos ni mayusculas ("pelota alimento" encuentra
  // "Pelota Porta Alimentos").
  const palabras = sinAcentos(busqueda).split(/\s+/).filter(Boolean);
  const filtrados = palabras.length
    ? porCategoria.filter((p) => {
        const texto = sinAcentos(
          [p.nombre, p.categoria, p.badge, p.descripcion].filter(Boolean).join(" ")
        );
        return palabras.every((w) => texto.includes(w));
      })
    : porCategoria;

  const iconoCategoria = (cat) => {
    if (cat === "Todos") return "🐾 ";
    if (cat === "Accesorios") return "🎀 ";
    if (cat === "Juguetes") return "🧸 ";
    if (cat === "Favoritos") return "❤️ ";
    return "";
  };

  const handleAgregar = (producto) => {
    agregar(producto, 1);
    setAbierto(true);
  };

  const handleWhatsApp = (producto) => {
    // Va el link a la pagina del producto: en WhatsApp se ve con su foto
    const link = urlProductoAbsoluta(producto);
    const message = encodeURIComponent(
      `¡Hola Kenypets! 🐾 Me interesa el producto: *${producto.nombre}* ($${producto.precio.toLocaleString("es-AR")}). ¿Tienen stock disponible?\n\n${link}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <section className="products" id="products">
      <div className="products__header">
        <small>NUESTROS PRODUCTOS</small>
        <h2>Todo lo que tu mascota necesita</h2>
        <p>Seleccionamos los mejores productos con amor y cuidado 🐾</p>
      </div>

      {cargando && (
        <div className="products__estado">
          <p>Cargando productos...</p>
        </div>
      )}

      {error && !cargando && (
        <div className="products__estado products__estado--error">
          <p>No pudimos cargar los productos en este momento.</p>
          <button
            className="products__filter-btn"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && (
        <>
          {/* BUSCADOR */}
          <div className="products__buscador">
            <span className="products__buscador-icono" aria-hidden="true">🔍</span>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              enterKeyHint="search"
            />
            {busqueda && (
              <button
                type="button"
                className="products__buscador-limpiar"
                onClick={() => setBusqueda("")}
                aria-label="Borrar busqueda"
              >
                ✕
              </button>
            )}
          </div>

          {/* FILTROS */}
          <div className="products__filters">
            {categorias.map((cat) => (
              <button
                key={cat}
                className={`products__filter-btn ${activeFilter === cat ? "active" : ""}`}
                onClick={() => setActiveFilter(cat)}
              >
                {iconoCategoria(cat)}
                {cat}
              </button>
            ))}
          </div>

          {filtrados.length === 0 && (
            <div className="products__estado products__sin-resultados">
              <p>
                {busqueda
                  ? `No encontramos productos para "${busqueda.trim()}"${
                      activeFilter !== "Todos" ? ` en ${activeFilter}` : ""
                    }.`
                  : "No hay productos en esta categoría todavía."}
              </p>
              <button
                className="products__filter-btn"
                onClick={() => {
                  setBusqueda("");
                  setActiveFilter("Todos");
                }}
              >
                Ver todos los productos
              </button>
            </div>
          )}

          {/* GRID */}
          <div className="products__grid">
            {filtrados.map((producto) => {
              const sinStock = producto.stock <= 0;
              const desc = producto.descripcion || "";
              const descLarga = desc.length > 110 || desc.includes("\n");
              const descAbierta = abiertas.has(producto.id);

              return (
                <div className="product-card" key={producto.id}>
                  {producto.badge && !sinStock && (
                    <span className="product-card__badge">{producto.badge}</span>
                  )}
                  {sinStock && (
                    <span className="product-card__badge product-card__badge--agotado">
                      Agotado
                    </span>
                  )}

                  <button
                    className={`product-card__fav ${esFavorito(producto.id) ? "activo" : ""}`}
                    onClick={() => alternar(producto)}
                    aria-label={
                      esFavorito(producto.id)
                        ? `Quitar ${producto.nombre} de favoritos`
                        : `Guardar ${producto.nombre} en favoritos`
                    }
                    title={esFavorito(producto.id) ? "Quitar de favoritos" : "Guardar en favoritos"}
                  >
                    {esFavorito(producto.id) ? "❤️" : "🤍"}
                  </button>

                  <a
                    className="product-card__image-wrap"
                    href={urlProducto(producto)}
                    onClick={alClickLink(urlProducto(producto))}
                    aria-label={`Ver ${producto.nombre}`}
                  >
                    <img
                      className="product-card__image"
                      src={urlImagen(producto.imagen, 600)}
                      alt={producto.nombre}
                      loading="lazy"
                    />
                  </a>

                  <div className="product-card__info">
                    <span className="product-card__category">
                      {producto.categoria}
                    </span>
                    <h3 className="product-card__name">
                      <a href={urlProducto(producto)} onClick={alClickLink(urlProducto(producto))}>
                        {producto.nombre}
                      </a>
                    </h3>
                    <p
                      className={`product-card__desc ${
                        descLarga && !descAbierta ? "product-card__desc--corta" : ""
                      }`}
                    >
                      {desc}
                    </p>
                    {descLarga && (
                      <button
                        type="button"
                        className="product-card__ver-mas"
                        onClick={() => alternarDescripcion(producto.id)}
                        aria-expanded={descAbierta}
                      >
                        {descAbierta ? "Ver menos" : "Ver más"}
                      </button>
                    )}
                  </div>

                  <div className="product-card__footer">
                    <span className="product-card__price">
                      ${producto.precio.toLocaleString("es-AR")}
                    </span>
                    <div className="product-card__acciones">
                      <button
                        className="product-card__btn-wsp"
                        onClick={() => handleWhatsApp(producto)}
                        title="Consultar por WhatsApp"
                        aria-label={`Consultar ${producto.nombre} por WhatsApp`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="18"
                          height="18"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                      </button>
                      <button
                        className="product-card__btn"
                        onClick={() => handleAgregar(producto)}
                        disabled={sinStock}
                      >
                        {sinStock ? "Sin stock" : "Agregar"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default Products;
