// GestionAdmin.jsx
import { Routes, Route } from 'react-router-dom';
import SidebarAdmin from '../components/layouts/SidebarAdmin';
import GestionClientes from '../pages/GestionClientes';
import GestionCategorias from '../pages/GestionCategorias';
import GestionArticulos from '../pages/GestionArticulos';

const GestionAdmin = () => {
    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <SidebarAdmin />
            {/* Área principal donde se renderizan las rutas */}
            <div className="flex-grow-1 p-4" style={{ marginLeft: '200px' }}>
                <Routes>
                    <Route path="Clientes" element={<GestionClientes />} />
                    <Route path="Categorias" element={<GestionCategorias />} />
                    <Route path="Articulos" element={<GestionArticulos />} />
                </Routes>
            </div>
        </div>
    );
};

export default GestionAdmin;
