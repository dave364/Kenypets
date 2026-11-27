import React from "react";

/* Set de iconos propio de Kenypets.
 *
 * Reemplazan a los emojis, que los dibuja Apple o Google: se ven distintos
 * en cada telefono, no combinan entre si y no son de nadie.
 *
 * Todos comparten el mismo sistema para que se lean como un conjunto:
 *   - lienzo de 24x24
 *   - trazo de 1.9 con puntas y codos redondeados, igual que la letra
 *     redondeada del logo
 *   - sin relleno, salvo donde el relleno dice algo (el corazon lleno
 *     significa "guardado")
 *   - color heredado del texto (currentColor), asi cada icono toma el
 *     color de donde esta sin tener que tocarlo
 */

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

const Svg = ({ children, tam = 20, ...resto }) => (
  <svg {...base} width={tam} height={tam} {...resto}>
    {children}
  </svg>
);

/* --- CATEGORIAS --- */

// Huella: tres dedos y la almohadilla con el arco recortado abajo,
// igual que la huella que ya tiene el logo adentro del gato.
export const Huella = (p) => (
  <Svg {...p}>
    <ellipse cx="7.2" cy="9.4" rx="2.1" ry="2.6" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="7.2" rx="2.1" ry="2.7" fill="currentColor" stroke="none" />
    <ellipse cx="16.8" cy="9.4" rx="2.1" ry="2.6" fill="currentColor" stroke="none" />
    <path d="M12 12.4c2.9 0 5 2.2 5 4.9v3.1h-2.6v-2.2a2.4 2.4 0 0 0-4.8 0v2.2H7v-3.1c0-2.7 2.1-4.9 5-4.9z" fill="currentColor" stroke="none" />
  </Svg>
);

// Moño: accesorios
export const Mono = (p) => (
  <Svg {...p}>
    <path d="M11.1 12 5.4 8.3c-.9-.6-2 .1-2 1.2v5c0 1.1 1.1 1.8 2 1.2L11.1 12z" />
    <path d="M12.9 12l5.7-3.7c.9-.6 2 .1 2 1.2v5c0 1.1-1.1 1.8-2 1.2L12.9 12z" />
    <rect x="10.5" y="10.1" width="3" height="3.8" rx="1.4" />
  </Svg>
);

// Pelota con estrellitas: juguetes
export const Pelota = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M12 3.8c-2.4 2.3-2.4 14.1 0 16.4M3.9 10.4c3.5 1.3 12.7 1.3 16.2 0" />
  </Svg>
);

// Corazon: favoritos. `lleno` lo pinta, que es lo que marca "guardado".
export const Corazon = ({ lleno = false, ...p }) => (
  <Svg {...p}>
    <path
      d="M12 20.3s-7.3-4.4-7.3-9.4c0-2.6 1.9-4.6 4.3-4.6 1.6 0 2.6.8 3 1.6.4-.8 1.4-1.6 3-1.6 2.4 0 4.3 2 4.3 4.6 0 5-7.3 9.4-7.3 9.4z"
      fill={lleno ? "currentColor" : "none"}
    />
  </Svg>
);

// Botella con gota: higiene y cuidado
export const Botella = (p) => (
  <Svg {...p}>
    <path d="M10 2.8h4v2.6h-4z" />
    <path d="M9.2 5.4h5.6c.9 0 1.6.8 1.6 1.7v11.9c0 1.2-.9 2.2-2 2.2H9.6c-1.1 0-2-1-2-2.2V7.1c0-.9.7-1.7 1.6-1.7z" />
    <path d="M12 11.2c1.1 1.3 1.8 2.3 1.8 3.2 0 1-.8 1.8-1.8 1.8s-1.8-.8-1.8-1.8c0-.9.7-1.9 1.8-3.2z" fill="currentColor" stroke="none" />
  </Svg>
);

// Remerita: ropa
export const Remera = (p) => (
  <Svg {...p}>
    <path d="M8.8 3.6 4 6.3l1.7 3.9 2-.9v10.9h8.6V9.3l2 .9L20 6.3l-4.8-2.7a3.3 3.3 0 0 1-6.4 0z" />
  </Svg>
);

// Carita de gato. La marca se llama Kenypets por Kenobi, asi que este
// es el unico icono con cara: es el que mas identidad carga.
export const Gato = (p) => (
  <Svg {...p}>
    <path d="M5.1 9.6 4.3 5.2c-.1-.6.6-1 1.1-.7l3.5 2.6a8.6 8.6 0 0 1 6.2 0l3.5-2.6c.5-.3 1.2.1 1.1.7l-.8 4.4a6.9 6.9 0 0 1 1.3 4c0 3.8-3.2 6.8-7.2 6.8s-7.2-3-7.2-6.8c0-1.5.5-2.9 1.3-4z" />
    <path d="M9.8 13.4h.01M14.2 13.4h.01" strokeWidth="2.5" />
    <path d="M12 15.4c-.5.6-1.3.6-1.8.1m1.8-.1c.5.6 1.3.6 1.8.1" />
  </Svg>
);

// Huesito: snacks
export const Hueso = (p) => (
  <Svg {...p}>
    <rect x="6.6" y="10.6" width="10.8" height="2.8" rx="1.4" fill="currentColor" stroke="none" />
    <circle cx="7" cy="9.8" r="2.3" fill="currentColor" stroke="none" />
    <circle cx="7" cy="14.2" r="2.3" fill="currentColor" stroke="none" />
    <circle cx="17" cy="9.8" r="2.3" fill="currentColor" stroke="none" />
    <circle cx="17" cy="14.2" r="2.3" fill="currentColor" stroke="none" />
  </Svg>
);

/* --- INTERFAZ --- */

export const Lupa = (p) => (
  <Svg {...p}>
    <circle cx="10.8" cy="10.8" r="6.4" />
    <path d="m15.6 15.6 4.1 4.1" />
  </Svg>
);

export const Cerrar = (p) => (
  <Svg {...p}>
    <path d="m6.6 6.6 10.8 10.8M17.4 6.6 6.6 17.4" />
  </Svg>
);

export const Bolsa = (p) => (
  <Svg {...p}>
    <path d="M5.4 7.8h13.2l-1 11.5c-.1 1-.9 1.8-1.9 1.8H8.3c-1 0-1.8-.8-1.9-1.8z" />
    <path d="M8.9 7.8V6.4a3.1 3.1 0 0 1 6.2 0v1.4" />
  </Svg>
);

export const Chat = (p) => (
  <Svg {...p}>
    <path d="M20.2 11.6c0 3.9-3.7 7-8.2 7-1 0-2-.2-2.9-.5l-4.3 1.4 1.4-3.6a6.6 6.6 0 0 1-2.4-4.9c0-3.9 3.7-7 8.2-7s8.2 3.1 8.2 7z" />
  </Svg>
);

export const Reloj = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M12 7.4V12l3 1.8" />
  </Svg>
);

export const Ojo = ({ tachado = false, ...p }) => (
  <Svg {...p}>
    <path d="M2.4 12s3.5-6.2 9.6-6.2S21.6 12 21.6 12s-3.5 6.2-9.6 6.2S2.4 12 2.4 12z" />
    <circle cx="12" cy="12" r="2.8" />
    {tachado && <path d="m4.2 19.8 15.6-15.6" />}
  </Svg>
);

export const Listo = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="m8.4 12.2 2.5 2.5 4.7-5" />
  </Svg>
);

export const Volver = (p) => (
  <Svg {...p}>
    <path d="M9.6 6.4 4.8 11.2l4.8 4.8" />
    <path d="M4.8 11.2h9.4a5 5 0 0 1 0 10h-2.6" />
  </Svg>
);

export const Escudo = (p) => (
  <Svg {...p}>
    <path d="M12 3.2 5.2 6v5.4c0 4.2 2.9 8.1 6.8 9.4 3.9-1.3 6.8-5.2 6.8-9.4V6z" />
    <path d="m9.2 11.8 2 2 3.6-3.8" />
  </Svg>
);

export const Caja = (p) => (
  <Svg {...p}>
    <path d="M3.6 8.2 12 4.2l8.4 4-8.4 4z" />
    <path d="M3.6 8.2v7.6l8.4 4 8.4-4V8.2" />
    <path d="M12 12.2v7.6" />
  </Svg>
);

export const Pin = (p) => (
  <Svg {...p}>
    <path d="M12 21.2s6-5.3 6-10a6 6 0 0 0-12 0c0 4.7 6 10 6 10z" />
    <circle cx="12" cy="11" r="2.3" />
  </Svg>
);

/* Elegir el icono de una categoria por su nombre. */
export const iconoDeCategoria = (categoria, props = {}) => {
  const mapa = {
    Todos: Huella,
    Accesorios: Mono,
    Juguetes: Pelota,
    Favoritos: Corazon,
    "Higiene y Cuidado": Botella,
    Ropa: Remera,
    Gatos: Gato,
    Snacks: Hueso,
  };
  const Icono = mapa[categoria];
  return Icono ? <Icono {...props} /> : null;
};
