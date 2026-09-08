import { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Products from './components/Products/Products';
import About from './components/About/About';
import Admin from './components/Admin/Admin';

function App() {
  // Ruteo minimo por hash: #admin muestra el panel, cualquier otra cosa
  // muestra la tienda. Alcanza para un sitio de una sola pagina y evita
  // sumar react-router solo para esto.
  const [esAdmin, setEsAdmin] = useState(
    () => window.location.hash === '#admin'
  );

  useEffect(() => {
    const alCambiarHash = () => setEsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', alCambiarHash);
    return () => window.removeEventListener('hashchange', alCambiarHash);
  }, []);

  if (esAdmin) return <Admin />;

  return (
    <>
      <Navbar />
      <Hero />
      <Products />
      <About />
    </>
  );
}

export default App;
