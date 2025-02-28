import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Context
import { AuthProvider } from "./context/AuthProvider";
import { UsuariosProvider } from "./context/UsuariosProvider";
import { ProductosProvider } from "./context/ProductosProvider";
import { VentaProvider } from "./context/VentaProvider";

// Layout (LayoutAuth)
import LayoutAuth from "./Layout/LayoutAuth";
import RutaProtegida from "./Layout/RutaProtegida";

// pages (usuarios)
import Login from "./pages/Login";
import Registro from "./pages/usuario/Registro";
import OlvidePassword from "./pages/usuario/OlvidePassword";
import Confirmar from "./pages/usuario/Confirmar";
// pages (usuarios protegidas)
import Perfil from "./pages/usuario/Perfil";
import CambiarPassword from "./pages/usuario/CambiarPassword.jsx";

// pages (productos) esta sera la vista del hs a modificar nombres de carpetas y archivos
import HomeHs from "./pages/productos/HomeHs";
import RegistroNewTrabajador from "./pages/productos/RegistroTrabajador.jsx";
//import DetalleProducto from "./pages/productos/DetalleProducto";
// import CarritoCompras from "./pages/productos/CarritoComprass";
// import { DataProvider } from "./context/DataProvider";

import DetalleVenta from './pages/venta/DetalleVenta';
import ListaVentas from './pages/venta/ListaVentas';
import EntregaEPP from "./pages/productos/EntregaEPP.jsx";
import BuscarTrabajadorEPP from "./pages/productos/BuscarTrabajadorEPP.jsx";

function App() {
  return (
    
      <Router>
        <AuthProvider>
          <UsuariosProvider>
            <ProductosProvider>
              <VentaProvider>
                <Routes>
                  {/* RUTAS PUBLICAS */}
                  <Route path="/" element={<LayoutAuth />}>
                    <Route index element={<Login />} />
                    <Route path="registro" element={<Registro />} />
                    <Route path="olvide-password" element={<OlvidePassword />} />
                    <Route path="confirmar/:id" element={<Confirmar />} />
                  </Route>
                  {/* Rutas Protegidas */}
                  <Route path="/perfil" element={<RutaProtegida />}>
                    <Route index element={<Perfil />} />
                    <Route path="cambiar-password" element={<CambiarPassword />} />
                  </Route>

                  <Route path="/homeHs" element={<RutaProtegida />}>
                    <Route index element={<HomeHs />} />
                    {/* <Route path="agregar-producto" index element={<FormularioProductos />} />
                    <Route path="detalle-producto/:id" element={<DetalleProducto />} /> */}
                  </Route>

                  <Route path="/registroTrabajador" element={<RutaProtegida />}>
                    <Route index element={<RegistroNewTrabajador />} />
                    {/* <Route path="agregar-producto" element={<FormularioProductos />} />
                    <Route path="detalle-producto/:id" element={<DetalleProducto />} /> */}
                  </Route>

                  <Route path="/entregaEpp" element={<RutaProtegida />}>
                    <Route index element={<EntregaEPP />} />
                    {/* <Route path="agregar-producto" element={<FormularioProductos />} />
                    <Route path="detalle-producto/:id" element={<DetalleProducto />} /> */}
                  </Route>

                  <Route path="/buscar-trabajador-epp" element={<RutaProtegida />}>
                    <Route index element={<BuscarTrabajadorEPP />} />
                  </Route>

                  <Route path='/venta' element={<RutaProtegida />}>
                    <Route index element={<DetalleVenta />} />
                    <Route path='compras-realizadas' element={<ListaVentas />} />
                  </Route>
 
                </Routes>
              </VentaProvider>
            </ProductosProvider>
          </UsuariosProvider>
        </AuthProvider>
      </Router>
  );
}
export default App;
