// SidebarAdmin.jsx
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../styles/SidebarAdmin.module.css';
import logoEditado from '../../assets/logoEditado.png';

const SidebarAdmin = () => {
    return (
        <div className={`d-flex ${styles.wrapper}`}>
            {/* Sidebar */}
            <div className={`bg-dark text-white ${styles.sidebar_wrapper}`}>
                <div className={`${styles.sidebar_heading} text-center py-4`}>
                    <img 
                        src={logoEditado} 
                        alt="Logo ShellTwice" 
                        style={{ width: '200px', margin: '8px 0' }}
                    />
                </div>
                <div className={`list-group list-group-flush`}>
                    <Link to="Clientes" className={`mb-4 mt-4 list-group-item list-group-item-action bg-dark text-white text-center`}>
                        <h5 className="mb-4">Gestión Usuarios</h5>
                    </Link>
                    <Link to="Categorias" className={`mb-4 list-group-item list-group-item-action bg-dark text-white text-center`}>
                        <h5 className="mb-4">Gestión Categorías</h5>
                    </Link>
                    <Link to="Articulos" className={`mb-4 list-group-item list-group-item-action bg-dark text-white text-center`}>
                        <h5 className="mb-4">Gestión Artículos</h5>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SidebarAdmin;
