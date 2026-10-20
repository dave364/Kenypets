// Links a la pagina de cada producto: /p/9-pelota-porta-alimentos
// El numero es lo unico que importa; el nombre va para que el link se
// entienda al compartirlo (si el producto cambia de nombre, sigue andando).

const BASE = import.meta.env.BASE_URL;

export const slug = (texto = "") =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // saca acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export const urlProducto = (p) => `${BASE}p/${p.id}-${slug(p.nombre)}`;

export const urlProductoAbsoluta = (p) => window.location.origin + urlProducto(p);

// Devuelve el id si la direccion actual es la de un producto, o null.
export function idProductoDeRuta(pathname = window.location.pathname) {
  const resto = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const m = resto.match(/^\/?p\/(\d+)/);
  return m ? Number(m[1]) : null;
}

// Cambia de pagina sin recargar (el App escucha "popstate").
export function navegar(url) {
  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

// Para usar en el onClick de un <a href=...>: si es un click normal,
// navega sin recargar; con Ctrl/Cmd o rueda del mouse deja abrir otra pestana.
export const alClickLink = (url) => (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
    return;
  }
  e.preventDefault();
  navegar(url);
};
