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
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritosProvider } from './context/FavoritosContext';

// Ruteo minimo por hash. Alcanza para un sitio de una sola pagina y
// evita sumar react-router solo para esto.
//   #admin        -> panel de administracion
//   #reset=TOKEN  -> pantalla para elegir contrasena nueva
function leerRuta() {
  const hash = window.location.hash;
  if (hash === '#admin') return { vista: 'admin' };
  if (hash.startsWith('#reset=')) {
    return { vista: 'reset', token: hash.slice('#reset='.length) };
  }
  return { vista: 'tienda' };
}

function App() {
  const [ruta, setRuta] = useState(leerRuta);

  useEffect(() => {
    const alCambiarHash = () => setRuta(leerRuta());
    window.addEventListener('hashchange', alCambiarHash);
    return () => window.removeEventListener('hashchange', alCambiarHash);
  }, []);

  if (ruta.vista === 'admin') return <Admin />;
  if (ruta.vista === 'reset') return <Reset token={ruta.token} />;

  return (
    <AuthProvider>
      <FavoritosProvider>
        <CartProvider>
          <Navbar />
          <Hero />
          <Products />
          <About />
          <Politicas />
          <Cart />
          <AuthModal />
          <FavoritosModal />
        </CartProvider>
      </FavoritosProvider>
    </AuthProvider>
  );
}

export default App;
