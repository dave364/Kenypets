import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "https://kenypets-api.onrender.com";
const CLAVE = "kenypets_sesion";

export const AuthProvider = ({ children }) => {
  const [sesion, setSesion] = useState(() => {
    try {
      const guardado = localStorage.getItem(CLAVE);
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  // Estado del modal: null = cerrado, "login" o "registro" = abierto en ese paso
  const [modal, setModal] = useState(null);

  useEffect(() => {
    try {
      if (sesion) localStorage.setItem(CLAVE, JSON.stringify(sesion));
      else localStorage.removeItem(CLAVE);
    } catch {
      // Modo incognito: la sesion vive en memoria y se pierde al recargar.
    }
  }, [sesion]);

  // Al cargar la pagina revalidamos el token contra el servidor.
  // Un token vencido o de un usuario borrado tiene que caducar solo,
  // en vez de dejar la interfaz mostrando una sesion que ya no existe.
  useEffect(() => {
    if (!sesion?.token) return;
    let vigente = true;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${sesion.token}` },
        });
        if (!vigente) return;
        if (res.status === 401) {
          setSesion(null);
        } else if (res.ok) {
          const data = await res.json();
          setSesion((s) => (s ? { ...s, usuario: data.usuario } : s));
        }
      } catch {
        // Sin conexion o API dormida: dejamos la sesion como esta.
        // Si el token estuviera mal, la primera llamada real lo va a rechazar.
      }
    })();

    return () => {
      vigente = false;
    };
    // Solo al montar: no queremos revalidar en cada cambio de sesion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Vuelve a pedir el usuario al servidor. Se usa despues de comprar:
  // el descuento se marca como usado del lado del backend, y si no
  // refrescamos, el cartel de "20% disponible" sigue mintiendo.
  const refrescarUsuario = useCallback(async () => {
    if (!sesion?.token) return null;
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${sesion.token}` },
      });
      if (res.status === 401) {
        setSesion(null);
        return null;
      }
      if (!res.ok) return null;
      const data = await res.json();
      setSesion((s) => (s ? { ...s, usuario: data.usuario } : s));
      return data.usuario;
    } catch {
      return null;
    }
  }, [sesion?.token]);

  const pedir = async (ruta, cuerpo) => {
    const res = await fetch(`${API_URL}${ruta}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detalle = data.detalles?.[0]?.mensaje;
      throw new Error(detalle || data.error || "Algo salio mal. Proba de nuevo.");
    }
    return data;
  };

  const login = async (email, password) => {
    const data = await pedir("/api/auth/login", { email, password });
    setSesion({ token: data.token, usuario: data.usuario });
    setModal(null);
    return data.usuario;
  };

  const registro = async (datos) => {
    const data = await pedir("/api/auth/registro", datos);
    setSesion({ token: data.token, usuario: data.usuario });
    setModal(null);
    return data.usuario;
  };

  const logout = () => setSesion(null);

  const usuario = sesion?.usuario ?? null;

  return (
    <AuthContext.Provider
      value={{
        token: sesion?.token ?? null,
        usuario,
        logueado: !!sesion?.token,
        // El descuento sigue disponible mientras no se haya usado
        tieneDescuento: !!usuario && !usuario.descuento_usado,
        login,
        registro,
        logout,
        refrescarUsuario,
        modal,
        abrirModal: (m = "registro") => setModal(m),
        cerrarModal: () => setModal(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth necesita estar dentro de <AuthProvider>");
  return ctx;
};
