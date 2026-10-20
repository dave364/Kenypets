// Las fotos de los productos pueden ser:
// - un nombre de archivo de public/products/ (las de siempre), o
// - una URL completa de Cloudinary (las que se suben desde el panel).

const BASE = import.meta.env.BASE_URL;

export const esUrl = (s) => /^https?:\/\//.test(s || "");

// URL para mostrar en la pagina. Con "ancho", a las fotos de Cloudinary
// les pide una version achicada y en el formato mas liviano para el
// navegador (webp/avif), asi la tienda carga rapido en el celular.
export function urlImagen(imagen, ancho) {
  if (!imagen) return `${BASE}logo.png`;
  if (esUrl(imagen)) {
    if (ancho && imagen.includes("res.cloudinary.com") && imagen.includes("/upload/")) {
      return imagen.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${ancho}/`);
    }
    return imagen;
  }
  return `${BASE}products/${imagen}`;
}

// URL completa (con dominio), para mandar por WhatsApp.
export function urlImagenAbsoluta(imagen) {
  const url = urlImagen(imagen, 800);
  return esUrl(url) ? url : window.location.origin + url;
}

// Todas las fotos de un producto, en orden (la primera es la principal).
// Los productos de antes de la galeria tienen solo "imagen".
export function fotosDe(producto) {
  if (Array.isArray(producto?.imagenes) && producto.imagenes.length) return producto.imagenes;
  return producto?.imagen ? [producto.imagen] : [];
}
