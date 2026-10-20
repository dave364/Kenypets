import React, { useState, useEffect, useCallback, useRef } from "react";
import { urlImagen, fotosDe } from "../../utils/imagen";
import "./Admin.scss";

const API_URL = import.meta.env.VITE_API_URL || "https://kenypets-api.onrender.com";

const ESTADOS = ["pendiente", "confirmado", "entregado", "cancelado"];

const PRODUCTO_VACIO = {
  nombre: "",
  categoria: "",
  descripcion: "",
  precio: 0,
  imagen: "",
  imagenes: [],
  badge: "",
  stock: 0,
  activo: true,
};

const plata = (n) => `$${Number(n).toLocaleString("es-AR")}`;

// Nombres de los campos tal como se ven en el formulario
const CAMPOS = {
  nombre: "Nombre",
  categoria: "Categoria",
  descripcion: "Descripcion",
  precio: "Precio",
  stock: "Stock",
  imagen: "Foto",
  imagenes: "Fotos",
  badge: "Badge",
  activo: "Visible en la tienda",
};

// Si la API dice "Datos invalidos", agrega que campos revisar.
const mensajeError = (data, status) => {
  const base = data.error || `Error ${status}`;
  if (!Array.isArray(data.detalles) || data.detalles.length === 0) return base;
  const campos = [...new Set(data.detalles.map((d) => CAMPOS[d.campo] || d.campo))];
  return `${base} Revisa: ${campos.join(", ")}.`;
};

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
        <button
          className={`admin__tab ${seccion === "clientes" ? "active" : ""}`}
          onClick={() => setSeccion("clientes")}
        >
          Clientes
        </button>
      </nav>

      {seccion === "productos" && (
        <PanelProductos token={token} onSesionVencida={salir} />
      )}
      {seccion === "pedidos" && (
        <PanelPedidos token={token} onSesionVencida={salir} />
      )}
      {seccion === "clientes" && (
        <PanelClientes token={token} onSesionVencida={salir} />
      )}
    </div>
  );
};

/* ============================================================
   PRODUCTOS
   ============================================================ */

// Lista sin vacios ni repetidos (sin importar mayusculas), en orden de aparicion
const unificarLista = (valores) => {
  const vistos = new Set();
  return valores
    .map((v) => (v || "").trim())
    .filter((v) => v && !vistos.has(v.toLowerCase()) && vistos.add(v.toLowerCase()));
};

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
      if (!res.ok) throw new Error(mensajeError(data, res.status));
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
      // La primera foto de la galeria es la principal
      imagenes: producto.imagenes,
      imagen: producto.imagenes[0] || null,
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
                  <div className="admin__producto-celda">
                    <img
                      className="admin__miniatura"
                      src={urlImagen(p.imagen, 120)}
                      alt=""
                      loading="lazy"
                    />
                    <div>
                      <strong>{p.nombre}</strong>
                      {p.badge && <span className="admin__pill">{p.badge}</span>}
                    </div>
                  </div>
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
          pedirFirma={() => pedir("/api/imagenes/firma", { method: "POST" })}
          categorias={[...new Set(productos.map((p) => p.categoria).filter(Boolean))].sort()}
          badges={unificarLista([...BADGES_BASE, ...productos.map((p) => p.badge)])}
        />
      )}
    </div>
  );
};

// Tope de Cloudinary en el plan gratis: 10 MB por foto
const FOTO_MAX_MB = 8;

// Tiene que coincidir con el limite de la API
const MAX_FOTOS = 8;

// Tiene que coincidir con el limite de la API
const DESCRIPCION_MAX = 2000;

// Valor especial del selector para escribir una opcion nueva
const OPCION_NUEVA = "__nueva__";

// Badges que siempre se ofrecen, aunque ningun producto los use todavia
const BADGES_BASE = ["Nuevo", "Mas vendido"];

// Si lo escrito ya existe con otras mayusculas o espacios ("accesorios "),
// devuelve la version existente para no duplicarla.
const unificar = (texto, opciones) => {
  const limpio = (texto || "").trim();
  return opciones.find((o) => o.toLowerCase() === limpio.toLowerCase()) || limpio;
};

// Selector con las opciones que ya existen y "+ Nueva..." para escribir
// una distinta. Se usa para la categoria y para el badge.
const CampoConLista = ({
  etiqueta,
  valor,
  opciones,
  onCambiar,
  textoElegir,
  textoNueva,
  placeholderNueva,
  textoVacio, // si viene, el campo es opcional y esta es la opcion "ninguno"
}) => {
  const [escribiendo, setEscribiendo] = useState(
    (!textoVacio && opciones.length === 0) ||
      (!!valor && !opciones.includes(valor))
  );

  const elegir = (e) => {
    if (e.target.value === OPCION_NUEVA) {
      setEscribiendo(true);
      onCambiar("");
    } else {
      onCambiar(e.target.value);
    }
  };

  const volverALista = () => {
    setEscribiendo(false);
    onCambiar("");
  };

  return (
    <label>
      {etiqueta}
      {escribiendo ? (
        <>
          <input
            value={valor || ""}
            onChange={(e) => onCambiar(e.target.value)}
            placeholder={placeholderNueva}
            autoFocus
          />
          {(opciones.length > 0 || textoVacio) && (
            <button type="button" className="admin__link" onClick={volverALista}>
              Elegir de la lista
            </button>
          )}
        </>
      ) : (
        <select value={valor || ""} onChange={elegir}>
          {textoVacio ? (
            <option value="">{textoVacio}</option>
          ) : (
            <option value="" disabled>
              {textoElegir}
            </option>
          )}
          {opciones.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          <option value={OPCION_NUEVA}>{textoNueva}</option>
        </select>
      )}
    </label>
  );
};

const ModalProducto = ({
  producto,
  onCancelar,
  onGuardar,
  pedirFirma,
  categorias = [],
  badges = [],
}) => {
  const [datos, setDatos] = useState(() => ({ ...producto, imagenes: fotosDe(producto) }));
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(null); // null o "Subiendo 1 de 3..."
  const [error, setError] = useState(null);
  const inputFoto = useRef(null);
  const cambiar = (campo) => (valor) => setDatos((d) => ({ ...d, [campo]: valor }));

  // La API firma la subida y el navegador manda la foto directo a
  // Cloudinary. Lo que vuelve es la URL definitiva de la foto.
  const subirUna = async (archivo) => {
    const firma = await pedirFirma();
    const form = new FormData();
    form.append("file", archivo);
    form.append("api_key", firma.apiKey);
    form.append("timestamp", firma.timestamp);
    form.append("folder", firma.folder);
    form.append("signature", firma.signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${firma.cloudName}/image/upload`,
      { method: "POST", body: form }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.secure_url) {
      throw new Error(data.error?.message || "No se pudo subir la foto.");
    }
    return data.secure_url;
  };

  // Se pueden elegir varias a la vez. Se suben de a una y cada una se
  // agrega a la galeria apenas termina, asi no se pierde nada si una falla.
  const subirFotos = async (e) => {
    const elegidos = [...(e.target.files || [])];
    e.target.value = "";
    if (elegidos.length === 0) return;

    const lugar = MAX_FOTOS - datos.imagenes.length;
    const problemas = [];
    if (elegidos.length > lugar) {
      problemas.push(`Entran hasta ${MAX_FOTOS} fotos: se subieron solo ${lugar}.`);
    }
    const validos = elegidos.slice(0, lugar).filter((a) => {
      if (!a.type.startsWith("image/")) {
        problemas.push(`"${a.name}" no es una imagen.`);
        return false;
      }
      if (a.size > FOTO_MAX_MB * 1024 * 1024) {
        problemas.push(`"${a.name}" pesa mas de ${FOTO_MAX_MB} MB.`);
        return false;
      }
      return true;
    });

    setError(null);
    for (let n = 0; n < validos.length; n++) {
      setSubiendo(validos.length > 1 ? `Subiendo ${n + 1} de ${validos.length}...` : "Subiendo...");
      try {
        const url = await subirUna(validos[n]);
        setDatos((d) => ({ ...d, imagenes: [...d.imagenes, url].slice(0, MAX_FOTOS) }));
      } catch (err) {
        problemas.push(`"${validos[n].name}": ${err.message}`);
      }
    }
    setSubiendo(null);
    if (problemas.length) setError(problemas.join(" "));
  };

  const moverFoto = (desde, hasta) =>
    setDatos((d) => {
      if (hasta < 0 || hasta >= d.imagenes.length) return d;
      const lista = [...d.imagenes];
      const [foto] = lista.splice(desde, 1);
      lista.splice(hasta, 0, foto);
      return { ...d, imagenes: lista };
    });

  const quitarFoto = (i) =>
    setDatos((d) => ({ ...d, imagenes: d.imagenes.filter((_, k) => k !== i) }));

  const set = (campo) => (e) => {
    const valor =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setDatos((d) => ({ ...d, [campo]: valor }));
  };

  const enviar = async () => {
    setGuardando(true);
    setError(null);
    try {
      await onGuardar({
        ...datos,
        categoria: unificar(datos.categoria, categorias),
        badge: unificar(datos.badge, badges) || null,
      });
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
          <CampoConLista
            etiqueta="Categoria"
            valor={datos.categoria}
            opciones={categorias}
            onCambiar={cambiar("categoria")}
            textoElegir="Elegi una categoria"
            textoNueva="+ Nueva categoria..."
            placeholderNueva="Nombre de la categoria nueva"
          />
          <CampoConLista
            etiqueta="Badge (opcional)"
            valor={datos.badge}
            opciones={badges}
            onCambiar={cambiar("badge")}
            textoVacio="Sin badge"
            textoNueva="+ Nuevo badge..."
            placeholderNueva="Ej: Oferta"
          />
        </div>

        <label>
          Descripcion
          <textarea
            rows="6"
            maxLength={DESCRIPCION_MAX}
            value={datos.descripcion || ""}
            onChange={set("descripcion")}
          />
          <small className="admin__contador">
            {(datos.descripcion || "").length} / {DESCRIPCION_MAX}
          </small>
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

        <div className="admin__foto">
          <span className="admin__foto-titulo">
            Fotos ({datos.imagenes.length} de {MAX_FOTOS})
          </span>
          <div className="admin__galeria">
            {datos.imagenes.map((foto, i) => (
              <div className="admin__galeria-item" key={foto + i}>
                <div className="admin__foto-vista">
                  <img src={urlImagen(foto, 300)} alt={`Foto ${i + 1}`} />
                  {i === 0 && <span className="admin__foto-principal">Principal</span>}
                </div>
                <div className="admin__galeria-botones">
                  <button
                    type="button"
                    onClick={() => moverFoto(i, i - 1)}
                    disabled={i === 0}
                    aria-label="Mover a la izquierda"
                    title="Mover a la izquierda"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    onClick={() => quitarFoto(i)}
                    aria-label="Quitar foto"
                    title="Quitar foto"
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    onClick={() => moverFoto(i, i + 1)}
                    disabled={i === datos.imagenes.length - 1}
                    aria-label="Mover a la derecha"
                    title="Mover a la derecha"
                  >
                    ▶
                  </button>
                </div>
              </div>
            ))}

            {datos.imagenes.length < MAX_FOTOS && (
              <button
                type="button"
                className="admin__galeria-agregar"
                onClick={() => inputFoto.current?.click()}
                disabled={!!subiendo}
              >
                {subiendo || (datos.imagenes.length ? "+ Agregar fotos" : "+ Subir fotos")}
              </button>
            )}
          </div>
          <small className="admin__foto-ayuda">
            La primera es la principal (la de la tarjeta). Podés elegir varias a
            la vez. JPG, PNG o WEBP, hasta {FOTO_MAX_MB} MB cada una.
          </small>
          <input
            ref={inputFoto}
            type="file"
            accept="image/*"
            multiple
            onChange={subirFotos}
            hidden
          />
        </div>

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
            disabled={guardando || !!subiendo || !datos.nombre || !datos.categoria}
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
      if (!res.ok) throw new Error(mensajeError(data, res.status));
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
            {abierto === p.id && (
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

/* ============================================================
   CLIENTES
   ============================================================ */

const PanelClientes = ({ token, onSesionVencida }) => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [soloConDescuento, setSoloConDescuento] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        onSesionVencida();
        throw new Error("Tu sesion vencio. Volve a entrar.");
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(mensajeError(data, res.status));
      setClientes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [token, onSesionVencida]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const cambiar = async (ruta, cuerpo, confirmacion) => {
    if (confirmacion && !window.confirm(confirmacion)) return;
    try {
      const res = await fetch(`${API_URL}/api/usuarios${ruta}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: cuerpo ? JSON.stringify(cuerpo) : undefined,
      });
      if (res.status === 401) {
        onSesionVencida();
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(mensajeError(data, res.status));
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  if (cargando) return <p className="admin__estado">Cargando clientes...</p>;

  const visibles = soloConDescuento
    ? clientes.filter((c) => c.descuento_disponible && c.rol !== "admin")
    : clientes;

  return (
    <div className="admin__contenido">
      {error && <p className="admin__error">{error}</p>}

      <div className="admin__acciones">
        <button
          className={`admin__btn ${soloConDescuento ? "admin__btn--primary" : ""}`}
          onClick={() => setSoloConDescuento((v) => !v)}
        >
          Solo con descuento sin usar
        </button>
        <button className="admin__btn admin__btn--ghost" onClick={cargar}>
          Actualizar
        </button>
      </div>

      {visibles.length === 0 && (
        <p className="admin__estado">No hay clientes que mostrar.</p>
      )}

      {visibles.length > 0 && (
        <div className="admin__tabla-wrap">
          <table className="admin__tabla">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>WhatsApp</th>
                <th>Pedidos</th>
                <th>Gastado</th>
                <th>Descuento</th>
                <th>Alta</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((c) => (
                <tr key={c.id} className={c.activo === false ? "admin__fila--baja" : ""}>
                  <td>
                    <strong>{c.nombre}</strong>
                    {c.rol === "admin" && (
                      <span className="admin__pill">admin</span>
                    )}
                    <span className="admin__cliente-mail">{c.email}</span>
                  </td>
                  <td>
                    <a
                      className="admin__cliente-wsp"
                      href={`https://wa.me/${c.telefono}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {c.telefono}
                    </a>
                  </td>
                  <td>
                    {c.pedidos}
                    {c.pendientes > 0 && (
                      <span className="admin__cliente-pend">
                        {c.pendientes} pend.
                      </span>
                    )}
                  </td>
                  <td>{plata(c.gastado)}</td>
                  <td>
                    {c.rol === "admin" ? (
                      <span className="admin__cliente-nada">—</span>
                    ) : c.descuento_disponible ? (
                      <span className="admin__cliente-si">Disponible</span>
                    ) : (
                      <span className="admin__cliente-no">Usado</span>
                    )}
                  </td>
                  <td>{fecha(c.creado_en)}</td>
                  <td className="admin__td-acciones">
                    {c.rol !== "admin" && (
                      <>
                        {!c.descuento_disponible && (
                          <button
                            className="admin__btn admin__btn--mini"
                            onClick={() =>
                              cambiar(
                                `/${c.id}/descuento`,
                                null,
                                `Devolverle el 20% de bienvenida a ${c.nombre}?`
                              )
                            }
                          >
                            Dar 20%
                          </button>
                        )}
                        <button
                          className={`admin__btn admin__btn--mini ${
                            c.activo === false ? "" : "admin__btn--peligro"
                          }`}
                          onClick={() =>
                            cambiar(
                              `/${c.id}/activo`,
                              { activo: c.activo === false },
                              c.activo === false
                                ? null
                                : `Suspender la cuenta de ${c.nombre}? No va a poder entrar ni comprar.`
                            )
                          }
                        >
                          {c.activo === false ? "Reactivar" : "Suspender"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
