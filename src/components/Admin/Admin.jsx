import React, { useState, useEffect, useCallback } from "react";
import "./Admin.scss";

const API_URL = import.meta.env.VITE_API_URL || "https://kenypets-api.onrender.com";

const ESTADOS = ["pendiente", "confirmado", "entregado", "cancelado"];

const PRODUCTO_VACIO = {
  nombre: "",
  categoria: "",
  descripcion: "",
  precio: 0,
  imagen: "",
  badge: "",
  stock: 0,
  activo: true,
};

const plata = (n) => `$${Number(n).toLocaleString("es-AR")}`;

const fecha = (iso) =>
  new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const Admin = () => {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [seccion, setSeccion] = useState("productos");

  // --- LOGIN ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState(null);
  const [entrando, setEntrando] = useState(false);

  const login = async () => {
    setEntrando(true);
    setErrorLogin(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No pudimos iniciar sesion.");
      if (data.usuario.rol !== "admin") {
        throw new Error("Esta cuenta no tiene permisos de administrador.");
      }
      setToken(data.token);
      setUsuario(data.usuario);
      setPassword("");
    } catch (err) {
      setErrorLogin(err.message);
    } finally {
      setEntrando(false);
    }
  };

  const salir = () => {
    setToken(null);
    setUsuario(null);
    setEmail("");
    setPassword("");
  };

  if (!token) {
    return (
      <div className="admin admin--login">
        <div className="admin__login-card">
          <h1>Kenypets</h1>
          <p className="admin__login-sub">Panel de administracion</p>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              autoComplete="username"
            />
          </label>

          <label>
            Contrasena
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              autoComplete="current-password"
            />
          </label>

          {errorLogin && <p className="admin__error">{errorLogin}</p>}

          <button
            className="admin__btn admin__btn--primary"
            onClick={login}
            disabled={entrando || !email || !password}
          >
            {entrando ? "Entrando..." : "Entrar"}
          </button>

          <a className="admin__volver" href="#home">
            ← Volver a la tienda
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <header className="admin__header">
        <div>
          <h1>Kenypets</h1>
          <span className="admin__usuario">{usuario?.nombre || usuario?.email}</span>
        </div>
        <div className="admin__header-acciones">
          <a className="admin__btn admin__btn--ghost" href="#home">
            Ver tienda
          </a>
          <button className="admin__btn admin__btn--ghost" onClick={salir}>
            Salir
          </button>
        </div>
      </header>

      <nav className="admin__tabs">
        <button
          className={`admin__tab ${seccion === "productos" ? "active" : ""}`}
          onClick={() => setSeccion("productos")}
        >
          Productos
        </button>
        <button
          className={`admin__tab ${seccion === "pedidos" ? "active" : ""}`}
          onClick={() => setSeccion("pedidos")}
        >
          Pedidos
        </button>
      </nav>

      {seccion === "productos" ? (
        <PanelProductos token={token} onSesionVencida={salir} />
      ) : (
        <PanelPedidos token={token} onSesionVencida={salir} />
      )}
    </div>
  );
};

/* ============================================================
   PRODUCTOS
   ============================================================ */

const PanelProductos = ({ token, onSesionVencida }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(null);

  const pedir = useCallback(
    async (ruta, opciones = {}) => {
      const res = await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...opciones.headers,
        },
      });
      // Un 401 aca significa que el token vencio: volvemos al login
      // en vez de dejar al usuario tocando botones que no hacen nada.
      if (res.status === 401) {
        onSesionVencida();
        throw new Error("Tu sesion vencio. Volve a entrar.");
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      return data;
    },
    [token, onSesionVencida]
  );

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setProductos(await pedir("/api/productos/todos"));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [pedir]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const guardar = async (producto) => {
    const esNuevo = !producto.id;
    const cuerpo = {
      nombre: producto.nombre,
      categoria: producto.categoria,
      descripcion: producto.descripcion || "",
      precio: Number(producto.precio),
      imagen: producto.imagen || null,
      badge: producto.badge || null,
      stock: Number(producto.stock),
      activo: producto.activo,
    };
    await pedir(esNuevo ? "/api/productos" : `/api/productos/${producto.id}`, {
      method: esNuevo ? "POST" : "PUT",
      body: JSON.stringify(cuerpo),
    });
    setEditando(null);
    cargar();
  };

  const borrar = async (producto) => {
    const ok = window.confirm(
      `Dar de baja "${producto.nombre}"?\n\nDeja de verse en la tienda, pero se conserva en los pedidos historicos.`
    );
    if (!ok) return;
    try {
      await pedir(`/api/productos/${producto.id}`, { method: "DELETE" });
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  if (cargando) return <p className="admin__estado">Cargando productos...</p>;

  return (
    <div className="admin__contenido">
      {error && <p className="admin__error">{error}</p>}

      <div className="admin__acciones">
        <button
          className="admin__btn admin__btn--primary"
          onClick={() => setEditando({ ...PRODUCTO_VACIO })}
        >
          + Nuevo producto
        </button>
        <button className="admin__btn admin__btn--ghost" onClick={cargar}>
          Actualizar
        </button>
      </div>

      <div className="admin__tabla-wrap">
        <table className="admin__tabla">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoria</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className={p.activo ? "" : "admin__fila--baja"}>
                <td>
                  <strong>{p.nombre}</strong>
                  {p.badge && <span className="admin__pill">{p.badge}</span>}
                </td>
                <td>{p.categoria}</td>
                <td>{plata(p.precio)}</td>
                <td>
                  <span className={p.stock <= 0 ? "admin__stock--cero" : ""}>
                    {p.stock}
                  </span>
                </td>
                <td>{p.activo ? "Activo" : "De baja"}</td>
                <td className="admin__td-acciones">
                  <button
                    className="admin__btn admin__btn--mini"
                    onClick={() => setEditando({ ...p })}
                  >
                    Editar
                  </button>
                  {p.activo && (
                    <button
                      className="admin__btn admin__btn--mini admin__btn--peligro"
                      onClick={() => borrar(p)}
                    >
                      Baja
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editando && (
        <ModalProducto
          producto={editando}
          onCancelar={() => setEditando(null)}
          onGuardar={guardar}
        />
      )}
    </div>
  );
};

const ModalProducto = ({ producto, onCancelar, onGuardar }) => {
  const [datos, setDatos] = useState(producto);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const set = (campo) => (e) => {
    const valor =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setDatos((d) => ({ ...d, [campo]: valor }));
  };

  const enviar = async () => {
    setGuardando(true);
    setError(null);
    try {
      await onGuardar(datos);
    } catch (err) {
      setError(err.message);
      setGuardando(false);
    }
  };

  return (
    <div className="admin__overlay" onClick={onCancelar}>
      <div className="admin__modal" onClick={(e) => e.stopPropagation()}>
        <h2>{datos.id ? "Editar producto" : "Nuevo producto"}</h2>

        <label>
          Nombre
          <input value={datos.nombre} onChange={set("nombre")} />
        </label>

        <div className="admin__fila-doble">
          <label>
            Categoria
            <input value={datos.categoria} onChange={set("categoria")} />
          </label>
          <label>
            Badge (opcional)
            <input value={datos.badge || ""} onChange={set("badge")} />
          </label>
        </div>

        <label>
          Descripcion
          <textarea
            rows="3"
            value={datos.descripcion || ""}
            onChange={set("descripcion")}
          />
        </label>

        <div className="admin__fila-doble">
          <label>
            Precio
            <input type="number" value={datos.precio} onChange={set("precio")} />
          </label>
          <label>
            Stock
            <input type="number" value={datos.stock} onChange={set("stock")} />
          </label>
        </div>

        <label>
          Imagen (nombre del archivo en public/products/)
          <input
            value={datos.imagen || ""}
            onChange={set("imagen")}
            placeholder="collar-ajustable-premium.jpg"
          />
        </label>

        <label className="admin__check">
          <input
            type="checkbox"
            checked={datos.activo}
            onChange={set("activo")}
          />
          Visible en la tienda
        </label>

        {error && <p className="admin__error">{error}</p>}

        <div className="admin__modal-acciones">
          <button className="admin__btn admin__btn--ghost" onClick={onCancelar}>
            Cancelar
          </button>
          <button
            className="admin__btn admin__btn--primary"
            onClick={enviar}
            disabled={guardando || !datos.nombre || !datos.categoria}
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   PEDIDOS
   ============================================================ */

const PanelPedidos = ({ token, onSesionVencida }) => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [abierto, setAbierto] = useState(null);

  const pedir = useCallback(
    async (ruta, opciones = {}) => {
      const res = await fetch(`${API_URL}${ruta}`, {
        ...opciones,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...opciones.headers,
        },
      });
      if (res.status === 401) {
        onSesionVencida();
        throw new Error("Tu sesion vencio. Volve a entrar.");
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      return data;
    },
    [token, onSesionVencida]
  );

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setPedidos(await pedir("/api/pedidos"));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [pedir]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const cambiarEstado = async (pedido, estado) => {
    // Confirmar dispara el descuento de bienvenida y cancelar devuelve stock:
    // los dos son irreversibles, asi que preguntamos antes.
    if (estado === "cancelado" || estado === "confirmado") {
      const ok = window.confirm(
        estado === "cancelado"
          ? `Cancelar el pedido #${pedido.numero ?? pedido.id}? Se devuelve el stock reservado.`
          : `Confirmar el pedido #${pedido.numero ?? pedido.id}?`
      );
      if (!ok) return;
    }
    try {
      await pedir(`/api/pedidos/${pedido.id}/estado`, {
        method: "PATCH",
        body: JSON.stringify({ estado }),
      });
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  if (cargando) return <p className="admin__estado">Cargando pedidos...</p>;

  return (
    <div className="admin__contenido">
      {error && <p className="admin__error">{error}</p>}

      <div className="admin__acciones">
        <button className="admin__btn admin__btn--ghost" onClick={cargar}>
          Actualizar
        </button>
      </div>

      {pedidos.length === 0 && (
        <p className="admin__estado">Todavia no hay pedidos.</p>
      )}

      <div className="admin__pedidos">
        {pedidos.map((p) => (
          <div className="admin__pedido" key={p.id}>
            <div
              className="admin__pedido-cab"
              onClick={() => setAbierto(abierto === p.id ? null : p.id)}
            >
              <div>
                <strong>#{p.numero ?? p.id}</strong> {p.cliente_nombre}
                <span className="admin__pedido-fecha">{fecha(p.creado_en)}</span>
              </div>
              <div className="admin__pedido-derecha">
                <span className={`admin__estado-pill admin__estado-pill--${p.estado}`}>
                  {p.estado}
                </span>
                <strong>{plata(p.total)}</strong>
              </div>
            </div>
Mostrar el numero de pedido en vez del id interno            {abierto === p.id && (
              <div className="admin__pedido-detalle">
                <p>
                  Telefono: <strong>{p.cliente_telefono}</strong>
                </p>

                {p.items?.length > 0 && (
                  <ul className="admin__items">
                    {p.items.map((i, n) => (
                      <li key={n}>
                        {i.cantidad} × {i.nombre || `Producto ${i.producto_id}`}
                        <span>{plata((i.precio_unitario ?? i.precio) * i.cantidad)}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {Number(p.descuento) > 0 && (
                  <p className="admin__descuento">
                    Descuento aplicado: −{plata(p.descuento)}
                  </p>
                )}

                <div className="admin__estados">
                  {ESTADOS.map((e) => (
                    <button
                      key={e}
                      className={`admin__btn admin__btn--mini ${p.estado === e ? "active" : ""}`}
                      onClick={() => cambiarEstado(p, e)}
                      disabled={p.estado === e}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
