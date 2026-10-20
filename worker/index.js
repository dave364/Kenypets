/* global HTMLRewriter */
// Worker de Kenypets.
// - fetch: sirve la tienda (los archivos de /dist) como siempre. Para los
//   links de producto (/p/9-nombre) arma la vista previa con la foto, el
//   nombre y el precio de ESE producto, asi se ve bien al compartirlo por
//   WhatsApp, Instagram o Facebook (esos servicios no ejecutan la pagina,
//   solo leen las etiquetas del HTML).
// - scheduled: cada 10 minutos le pega a la API para que Render no la duerma.
//   Antes lo hacia una tarea de GitHub Actions, pero GitHub la corria
//   cada 4 o 5 horas en vez de cada 10 minutos.

const API_PRODUCCION = "https://kenypets-api.onrender.com";
// En pruebas locales se puede apuntar a otra API con la variable API_URL
const api = (env) => env.API_URL || API_PRODUCCION;

const plata = (n) =>
  "$" + Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// Descripcion en una sola linea y cortada, como la muestran las vistas previas
const resumen = (texto, max = 160) => {
  const limpio = (texto || "").replace(/\s+/g, " ").trim();
  return limpio.length > max ? limpio.slice(0, max - 1).trimEnd() + "…" : limpio;
};

// Foto para la vista previa: las de Cloudinary se recortan al formato
// apaisado 1200x630 que usan WhatsApp y Facebook para la tarjeta grande.
function fotoParaCompartir(imagen, origen) {
  if (!imagen) return { url: origen + "/og.jpg", ancho: 1200, alto: 630 };
  if (/^https?:\/\//.test(imagen)) {
    if (imagen.includes("res.cloudinary.com") && imagen.includes("/upload/")) {
      return {
        url: imagen.replace("/upload/", "/upload/c_pad,b_white,w_1200,h_630,f_jpg,q_auto/"),
        ancho: 1200,
        alto: 630,
      };
    }
    return { url: imagen };
  }
  return { url: origen + "/products/" + imagen };
}

async function paginaProducto(request, env, url, id) {
  // La pagina en si es siempre el index.html de la tienda
  const pagina = await env.ASSETS.fetch(new Request(new URL("/", url), request));

  let producto = null;
  try {
    const res = await fetch(`${api(env)}/api/productos/${id}`, {
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) producto = await res.json();
  } catch {
    // Si la API tarda o falla, va la pagina igual con la vista previa general
  }
  if (!producto) return pagina;

  const titulo = `${producto.nombre} - ${plata(producto.precio)} | KenyPets`;
  const descripcion =
    resumen(producto.descripcion) || `${producto.categoria} en KenyPets. Nuestros amigos primero.`;
  const foto = fotoParaCompartir(producto.imagen, url.origin);
  const enlace = url.origin + url.pathname;

  const poner = (valor) => ({
    element(el) {
      el.setAttribute("content", valor);
    },
  });

  const respuesta = new HTMLRewriter()
    .on("title", {
      element(el) {
        el.setInnerContent(titulo);
      },
    })
    .on('meta[name="description"]', poner(descripcion))
    .on('meta[property="og:type"]', poner("product"))
    .on('meta[property="og:url"]', poner(enlace))
    .on('meta[property="og:title"]', poner(titulo))
    .on('meta[property="og:description"]', poner(descripcion))
    .on('meta[property="og:image"]', poner(foto.url))
    .on('meta[property="og:image:alt"]', poner(producto.nombre))
    .on('meta[property="og:image:width"]', {
      element(el) {
        if (foto.ancho) el.setAttribute("content", String(foto.ancho));
        else el.remove();
      },
    })
    .on('meta[property="og:image:height"]', {
      element(el) {
        if (foto.alto) el.setAttribute("content", String(foto.alto));
        else el.remove();
      },
    })
    .transform(pagina);

  const headers = new Headers(respuesta.headers);
  headers.set("Cache-Control", "public, max-age=300");
  return new Response(respuesta.body, { status: 200, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const m = url.pathname.match(/^\/p\/(\d+)/);
    if (m && (request.method === "GET" || request.method === "HEAD")) {
      return paginaProducto(request, env, url, m[1]);
    }
    return env.ASSETS.fetch(request);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(
      fetch(api(env) + "/api/health", { headers: { "User-Agent": "kenypets-keepalive" } })
        .then((r) => console.log("health", r.status))
        .catch((e) => console.log("health error", e.message))
    );
  },
};
