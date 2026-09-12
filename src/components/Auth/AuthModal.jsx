import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { normalizarTelefono, telefonoParece } from "../../utils/telefono";
import "./AuthModal.scss";

const AuthModal = () => {
  const { modal, cerrarModal, abrirModal, login, registro } = useAuth();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const esRegistro = modal === "registro";

  // Al cambiar de paso limpiamos el error, pero conservamos email y nombre:
  // si alguien intento registrarse y ya tenia cuenta, no queremos que
  // vuelva a tipear todo para loguearse.
  useEffect(() => {
    setError(null);
    setPassword("");
    setEnviando(false);
  }, [modal]);

  if (!modal) return null;

  const enviar = async () => {
    setEnviando(true);
    setError(null);
    try {
      if (esRegistro) {
        await registro({
          nombre: nombre.trim(),
          email: email.trim(),
          telefono: normalizarTelefono(telefono),
          password,
        });
      } else {
        await login(email.trim(), password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      // Tiene que volver a false tambien cuando sale bien: si no, el
      // boton queda deshabilitado para siempre y no se puede volver
      // a entrar sin recargar la pagina.
      setEnviando(false);
    }
  };

  const listo = esRegistro
    ? nombre.trim().length >= 2 &&
      email.includes("@") &&
      telefonoParece(telefono) &&
      password.length >= 8
    : email.includes("@") && password.length > 0;

  const alPresionar = (e) => {
    if (e.key === "Enter" && listo && !enviando) enviar();
  };

  return (
    <div className="auth-overlay" onClick={cerrarModal}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__cerrar" onClick={cerrarModal}>
          ✕
        </button>

        <h2>{esRegistro ? "Crear cuenta" : "Iniciar sesión"}</h2>

        {esRegistro && (
          <p className="auth-modal__promo">
            🐾 Al registrarte obtenés <strong>20% de descuento</strong> en tu
            primer pedido.
          </p>
        )}

        {esRegistro && (
          <label className="auth-campo">
            Nombre y apellido
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={alPresionar}
              placeholder="Ana Pérez"
              autoComplete="name"
            />
          </label>
        )}

        <label className="auth-campo">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={alPresionar}
            placeholder="ana@email.com"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
          />
        </label>

        {esRegistro && (
          <label className="auth-campo">
            WhatsApp
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              onKeyDown={alPresionar}
              placeholder="11 2345 6789"
              inputMode="numeric"
              autoComplete="tel"
            />
            <small>Lo usamos para coordinar tus pedidos.</small>
          </label>
        )}

        <label className="auth-campo">
          Contraseña
          <div className="auth-campo__password">
            <input
              type={verPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={alPresionar}
              autoComplete={esRegistro ? "new-password" : "current-password"}
            />
            <button
              type="button"
              onClick={() => setVerPassword((v) => !v)}
              aria-label={verPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {verPassword ? "🙈" : "👁"}
            </button>
          </div>
          {esRegistro && <small>Mínimo 8 caracteres.</small>}
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button
          className="auth-btn auth-btn--principal"
          onClick={enviar}
          disabled={!listo || enviando}
        >
          {enviando
            ? "Un momento..."
            : esRegistro
            ? "Crear mi cuenta"
            : "Entrar"}
        </button>

        <p className="auth-modal__cambiar">
          {esRegistro ? "¿Ya tenés cuenta?" : "¿Todavía no tenés cuenta?"}{" "}
          <button onClick={() => abrirModal(esRegistro ? "login" : "registro")}>
            {esRegistro ? "Iniciar sesión" : "Registrate"}
          </button>
        </p>

        {!esRegistro && (
          <p className="auth-modal__ayuda">
            ¿Olvidaste tu contraseña? Escribinos por WhatsApp y te ayudamos.
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
