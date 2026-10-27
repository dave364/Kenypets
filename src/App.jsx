import { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Products from './components/Products/Products';
import About from './components/About/About';
import Politicas from './components/Politicas/Politicas';
import Admin from './components/Admin/Admin';
import Reset from './components/Reset/Reset';
import Cart from './components/Cart/Cart';
import AuthModal from './components/Auth/AuthModal';
import FavoritosModal from './components/Favoritos/FavoritosModal';
import ProductoDetalle from './components/ProductoDetalle/ProductoDetalle';
import Mantenimiento from './components/Mantenimiento/Mantenimiento';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritosProvider } from './context/FavoritosContext';
import { idProductoDeRuta } from './utils/rutas';

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
  if (ruta.vista === 'admin') return <><Admin /><Mantenimiento /></>;
  if (ruta.vista === 'reset') return <><Reset token={ruta.token} /><Mantenimiento /></>;

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
