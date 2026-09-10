import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const FavoritosContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "https://kenypets-api.onrender.com";

export const FavoritosProvider = ({ children }) => {
  const { token, logueado, abrirModal } = useAuth();

  // Guardamos solo los ids en un Set: la pregunta que mas se hace es
  // "¿este producto es favorito?" y con un Set es inmediata.
  const [ids, setIds] = useState(() => new Set());
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    if (!token) {
      setIds(new Set());
      setProductos([]);
      return;
    }
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/api/favoritos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("no se pudo");
      const data = await res.json();
      setProductos(data);
      setIds(new Set(data.map((p) => p.id)));
    } catch {
      // Si falla dejamos la lista como estaba: es preferible mostrar
      // datos viejos que vaciar los corazones de golpe.
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const alternar = async (producto) => {
    if (!logueado) {
      abrirModal("registro");
      return;
    }

    const id = producto.id;
    const eraFavorito = ids.has(id);

    // Actualizamos la interfaz antes de que responda el servidor:
    // el corazon tiene que sentirse instantaneo. Si la llamada falla,
    // lo revertimos abajo.
    setIds((prev) => {
      const copia = new Set(prev);
      if (eraFavorito) copia.delete(id);
      else copia.add(id);
      return copia;
    });
    setProductos((prev) =>
      eraFavorito ? prev.filter((p) => p.id !== id) : [producto, ...prev]
    );

    try {
      const res = await fetch(`${API_URL}/api/favoritos/${id}`, {
        method: eraFavorito ? "DELETE" : "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("no se pudo");
    } catch {
      // Revertimos y volvemos a pedir la lista real al servidor.
      setIds((prev) => {
        const copia = new Set(prev);
        if (eraFavorito) copia.add(id);
        else copia.delete(id);
        return copia;
      });
      cargar();
    }
  };

  return (
    <FavoritosContext.Provider
      value={{
        ids,
        productos,
        cargando,
        cantidad: ids.size,
        esFavorito: (id) => ids.has(id),
        alternar,
        recargar: cargar,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error("useFavoritos necesita estar dentro de <FavoritosProvider>");
  return ctx;
};
