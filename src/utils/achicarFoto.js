// Achica la foto en el celular antes de subirla: una foto de camara
// (4000px, 3-5 MB) queda en 1600px y unos 200-400 KB. Sube mucho mas
// rapido con datos moviles y ocupa menos en Cloudinary. En la tienda no
// se nota: nunca se muestra a mas de 1000px.
//
// Si el navegador no puede leer la foto (por ejemplo HEIC en algunas
// compus), devuelve la original y Cloudinary se encarga.

const LADO_MAX = 1600;
const CALIDAD = 0.85;

export async function achicarFoto(archivo) {
  // GIF animados y SVG se suben tal cual
  if (/gif|svg/i.test(archivo.type)) return archivo;

  let bitmap;
  try {
    // "from-image" respeta la orientacion de la foto (vertical/horizontal)
    bitmap = await createImageBitmap(archivo, { imageOrientation: "from-image" });
  } catch {
    return archivo;
  }

  const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height));
  // Si ya es chica y liviana, no vale la pena tocarla
  if (escala === 1 && archivo.size < 600 * 1024) {
    bitmap.close?.();
    return archivo;
  }

  const ancho = Math.round(bitmap.width * escala);
  const alto = Math.round(bitmap.height * escala);
  const canvas = document.createElement("canvas");
  canvas.width = ancho;
  canvas.height = alto;
  const ctx = canvas.getContext("2d");
  // Fondo blanco: los PNG con transparencia no quedan negros al pasar a JPG
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, ancho, alto);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, ancho, alto);
  bitmap.close?.();

  const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", CALIDAD));
  // Si por algun motivo quedo mas pesada que la original, sube la original
  if (!blob || blob.size >= archivo.size) return archivo;

  const nombre = archivo.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], nombre, { type: "image/jpeg", lastModified: Date.now() });
}
