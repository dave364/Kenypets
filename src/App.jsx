import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Products from './components/Products/Products';
import About from './components/About/About';
import Politicas from './components/Politicas/Politicas';
import Cart from './components/Cart/Cart';
import AuthModal from './components/Auth/AuthModal';
import FavoritosModal from './components/Favoritos/FavoritosModal';
import ProductoDetalle from './components/ProductoDetalle/ProductoDetalle';
import Footer from './components/Footer/Footer';
import Mantenimiento from './components/Mantenimiento/Mantenimiento';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritosProvider } from './context/FavoritosContext';
import { idProductoDeRuta } from './utils/rutas';

// El panel de administracion y la pantalla de contraseña nueva se bajan
// recien cuando hacen falta. Son pantallas que usa una sola persona, y
// antes viajaban en el mismo archivo que la tienda: todos los visitantes
// se descargaban el panel sin abrirlo nunca.
const Admin = lazy(() => import('./components/Admin/Admin'));
const Reset = lazy(() => import('./components/Reset/Reset'));

// Lo que se ve el segundo que tarda en llegar ese pedazo.
const Cargando = () => (
  <div
    style={{
      minHeight: '100dvh',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--color-light)',
      color: 'var(--color-purple)',
      fontFamily: 'var(--text-font)',
    }}
  >
    Cargando…
  </div>
);

// Ruteo minimo, sin react-router:
//   #admin        -> panel de administracion
//   #reset=TOKEN  -> pantalla para elegir contrasena nueva
//   /p/9-nombre   -> pagina de un producto (es una ruta de verdad, no un
//                    hash, para que el link compartido tenga su vista previa)
function leerRuta() {
  const hash = window.location.hash;
  if (hash === '#admin') return { vista: 'admin' };
  if (hash.startsWith('#reset=')) {
    return { vista: 'reset', token: hash.slice('#reset='.length) };
  }
  const id = idProductoDeRuta();
  if (id) return { vista: 'producto', id };
  return { vista: 'tienda' };
}

// Lleva hasta la seccion del hash (#products, #about...) una vez dibujada.
function irASeccion() {
  const hash = window.location.hash;
  if (!hash || hash === '#admin' || hash.startsWith('#reset=')) return;
  setTimeout(() => {
    try {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    } catch {
      // un hash raro no es un selector valido: no hacemos nada
    }
  }, 60);
}

function App() {
  const [ruta, setRuta] = useState(leerRuta);

  useEffect(() => {
    const alCambiarHash = () => {
      // Desde la pagina de un producto, los links del menu (#products,
      // #about...) tienen que volver a la tienda.
      const hash = window.location.hash;
      if (idProductoDeRuta() && hash !== '#admin' && !hash.startsWith('#reset=')) {
        window.history.replaceState({}, '', import.meta.env.BASE_URL + hash);
      }
      setRuta(leerRuta());
      irASeccion();
    };
    const alNavegar = () => {
      setRuta(leerRuta());
      irASeccion();
    };
    window.addEventListener('hashchange', alCambiarHash);
    window.addEventListener('popstate', alNavegar);
    return () => {
      window.removeEventListener('hashchange', alCambiarHash);
      window.removeEventListener('popstate', alNavegar);
    };
  }, []);

  // El cartel de mantenimiento se muestra solo si la API no responde
  if (ruta.vista === 'admin')
    return (
      <Suspense fallback={<Cargando />}>
        <Admin />
        <Mantenimiento />
      </Suspense>
    );
  if (ruta.vista === 'reset')
    return (
      <Suspense fallback={<Cargando />}>
        <Reset token={ruta.token} />
        <Mantenimiento />
      </Suspense>
    );

  return (
    <AuthProvider>
      <FavoritosProvider>
        <CartProvider>
          <Navbar />
          {ruta.vista === 'producto' ? (
            <ProductoDetalle id={ruta.id} />
          ) : (
            <>
              <Hero />
              <Products />
              <About />
              <Politicas />
            </>
          )}
          <Footer />
          <Cart />
          <AuthModal />
          <FavoritosModal />
          <Mantenimiento />
        </CartProvider>
      </FavoritosProvider>
    </AuthProvider>
  );
}

export default App;
