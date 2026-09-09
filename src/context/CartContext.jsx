import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const CLAVE = "kenypets_carrito";

export const CartProvider = ({ children }) => {
  // El carrito sobrevive a un refresh o a que cierren la pestana.
  // Guardamos solo id y cantidad: el precio siempre lo decide el servidor,
  // asi que aunque alguien edite esto a mano no cambia lo que paga.
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem(CLAVE);
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch {
      // Modo incognito o storage lleno: el carrito sigue funcionando
      // en memoria, solo que no persiste.
    }
  }, [items]);

  const agregar = (producto, cantidad = 1) => {
    setItems((actuales) => {
      const existente = actuales.find((i) => i.id === producto.id);
      const enCarrito = existente ? existente.cantidad : 0;
      // Nunca dejamos meter mas unidades de las que hay en stock.
      const tope = Math.min(enCarrito + cantidad, producto.stock);
      if (tope <= 0) return actuales;

      if (existente) {
        return actuales.map((i) =>
          i.id === producto.id ? { ...i, cantidad: tope } : i
        );
      }
      return [
        ...actuales,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          stock: producto.stock,
          cantidad: tope,
        },
      ];
    });
  };

  const cambiarCantidad = (id, cantidad) => {
    setItems((actuales) =>
      actuales
        .map((i) =>
          i.id === id
            ? { ...i, cantidad: Math.max(0, Math.min(cantidad, i.stock)) }
            : i
        )
        .filter((i) => i.cantidad > 0)
    );
  };

  const quitar = (id) =>
    setItems((actuales) => actuales.filter((i) => i.id !== id));

  const vaciar = () => setItems([]);

  const unidades = items.reduce((n, i) => n + i.cantidad, 0);
  const subtotal = items.reduce((n, i) => n + i.precio * i.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        agregar,
        cambiarCantidad,
        quitar,
        vaciar,
        unidades,
        subtotal,
        abierto,
        setAbierto,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart necesita estar dentro de <CartProvider>");
  return ctx;
};
