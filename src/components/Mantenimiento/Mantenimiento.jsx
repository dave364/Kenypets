import React, { useState, useEffect, useCallback, useRef } from "react";
import "./Mantenimiento.scss";

// Cartel de "estamos en mantenimiento".
//
// No hay que prenderlo ni apagarlo a mano: al abrir la pagina se
// pregunta a la API si esta viva. Si no responde (Render caido o
// suspendido), aparece el cartel y se reintenta cada 30 segundos.
// Cuando la API vuelve, la pagina se recarga sola y la tienda sigue
// como siempre.

const API_URL = import.meta.env.VITE_API_URL || "https://kenypets-api.onrender.com";
const BASE = import.meta.env.BASE_URL;
const WHATSAPP = "https://wa.me/5491122531821?text=" +
  encodeURIComponent("¡Hola Kenypets! 🐾 Quería hacer una consulta.");
const INSTAGRAM = "https://www.instagram.com/kenypets.store/";

// Una API dormida en Render tarda un rato en despertar: le damos tiempo
// antes de decidir que esta caida.
const ESPERA_MS = 20000;
const REINTENTO_MS = 30000;

async function apiViva() {
  try {
    const res = await fetch(`${API_URL}/api/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(ESPERA_MS),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const Mantenimiento = () => {
  const [caida, setCaida] = useState(false);
  const [probando, setProbando] = useState(false);
  const estuvoCaida = useRef(false);

  const revisar = useCallback(async () => {
    setProbando(true);
    const viva = await apiViva();
    setProbando(false);
    if (viva) {
      // Si estaba el cartel, recargamos para traer productos, sesion, etc.
      if (estuvoCaida.current) window.location.reload();
      setCaida(false);
    } else {
      estuvoCaida.current = true;
      setCaida(true);
    }
  }, []);

  useEffect(() => {
    revisar();
  }, [revisar]);

  useEffect(() => {
    if (!caida) return;
    const id = setInterval(revisar, REINTENTO_MS);
    return () => clearInterval(id);
  }, [caida, revisar]);

  // Mientras se muestra el cartel, que no se pueda scrollear lo de atras
  useEffect(() => {
    document.body.style.overflow = caida ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [caida]);

  if (!caida) return null;

  return (
    <div className="mantenimiento" role="alertdialog" aria-labelledby="mant-titulo">
      <div className="mantenimiento__tarjeta">
        <img className="mantenimiento__logo" src={`${BASE}logo.png`} alt="Kenypets" />
        <h1 id="mant-titulo">Estamos en mantenimiento</h1>
        <p>
          Estamos haciendo mejoras en la tienda y volvemos muy pronto 🐾
        </p>
        <p className="mantenimiento__sub">
          Mientras tanto, podés escribirnos y te ayudamos con tu pedido.
        </p>

        <div className="mantenimiento__botones">
          <a className="mantenimiento__btn mantenimiento__btn--wsp" href={WHATSAPP} target="_blank" rel="noreferrer">
            Escribinos por WhatsApp
          </a>
          <a className="mantenimiento__btn mantenimiento__btn--borde" href={INSTAGRAM} target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>

        <button className="mantenimiento__reintentar" onClick={revisar} disabled={probando}>
          {probando ? "Revisando..." : "Volver a intentar"}
        </button>
        <small className="mantenimiento__nota">
          La página se va a actualizar sola apenas volvamos.
        </small>
      </div>
    </div>
  );
};

export default Mantenimiento;
