// Normaliza cualquier formato argentino a 549XXXXXXXXXX, que es lo que
// espera WhatsApp y lo que valida el backend.
// "11 2345 6789", "011 15 2345-6789" y "+54 9 11 2345 6789" dan lo mismo.
export const normalizarTelefono = (t) => {
  let d = String(t).replace(/\D/g, "");
  if (d.startsWith("54")) d = d.slice(2);
  if (d.startsWith("9")) d = d.slice(1);
  if (d.startsWith("0")) d = d.slice(1);
  // Los celulares argentinos se escriben con un 15 antes del numero local
  if (d.length > 10 && d.slice(2, 4) === "15") d = d.slice(0, 2) + d.slice(4);
  return "549" + d;
};

// Para habilitar botones antes de normalizar: pedimos al menos 8 digitos.
export const telefonoParece = (t) => String(t).replace(/\D/g, "").length >= 8;
