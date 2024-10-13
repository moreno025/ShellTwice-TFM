import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import style from '../../styles/Header.module.css';
import logo from '../../assets/logoEditado.png';
import profilePic from '../../assets/fotoPerfil.jpg';
import { Modal, Button } from 'react-bootstrap';
import CrearAnuncio from '../Forms/CrearAnuncio';

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const [showSidebar, setShowSidebar] = useState(false);
    const [showModal, setShowModal] = useState(false); // Controlar el estado del modal de CrearAnuncio
    const [showLoginModal, setShowLoginModal] = useState(false); // Controlar el estado del modal de Login
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const toggleSidebar = () => setShowSidebar(!showSidebar);

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleProfileRedirect = () => {
        navigate('/profile');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleVenderClick = () => {
        if (isAuthenticated) {
            setShowModal(true);
        } else {
            setShowLoginModal(true);
        }
    };

    const handleCloseModal = () => setShowModal(false);
    const handleCloseLoginModal = () => setShowLoginModal(false);

    const handleSearch = async (event) => {
        event.preventDefault();
    
        if (searchQuery.trim() !== '') {
            try {
                const response = await fetch(`http://localhost:3001/articulo/buscar?query=${encodeURIComponent(searchQuery)}`);
                if (!response.ok) {
                    throw new Error(`Error en la búsqueda: ${response.status} - ${response.statusText}`);
                }
                const result = await response.json();
                navigate(`/resultados?query=${encodeURIComponent(searchQuery)}`, { state: { articulos: result.articulos, searchQuery: searchQuery } });
            } catch (error) {
                console.error('Error al buscar:', error.message);
            }
        }
    };

    return (
        <>
            <nav className={`navbar navbar-expand-lg bg-body-tertiary ${style.container_navbar}`}>
                <div className={`container-fluid`}>
                    <a className={`navbar-brand ${style.container}`} href="/">
                        <img src={logo} alt="Logo" width="150" height="50" className={`d-inline-block align-text-top`} />
                    </a>

                    <button className={`navbar-toggler`} type="button" onClick={toggleSidebar} aria-controls="offcanvasRight" aria-expanded={showSidebar} aria-label="Toggle navigation">
                        <span className={`navbar-toggler-icon`}></span>
                    </button>

                    <div className={`collapse navbar-collapse ${showSidebar ? 'show' : ''}`}>
                        <form className={`d-none d-lg-flex mx-auto`} role="search" onSubmit={handleSearch}>
                            <input
                                className={`form-control me-2 ${style.input_search}`}
                                type="search"
                                placeholder="Busca cualquier producto"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className={`btn btn-outline-success ${style.boton_search}`} type="submit">
                                <i className={`bi bi-search`}></i>
                            </button>
                        </form>

                        <div className={`d-none d-lg-flex align-items-center`}>
                            {isAuthenticated ? (
                                <div className={`d-flex align-items-center`}>
                                    <img src={profilePic} alt="Perfil" className={`rounded-circle me-2 ${style.profile_pic}`} style={{ width: '40px', height: '40px' }} />
                                    <span className={`me-3`} onClick={handleProfileRedirect} style={{ cursor: 'pointer' }}>Mi Perfil</span>
                                    <button type="button" className={`btn btn-outline-success ${style.boton_vender}`} onClick={handleVenderClick}>
                                        <i className={`bi bi-plus-circle`}></i> Vende
                                    </button>
                                    <button type="button" className={`btn btn-outline-success ${style.boton_login}`} onClick={handleLogout}>Cerrar Sesión</button>
                                </div>
                            ) : (
                                <>
                                    <button type="button" className={`btn btn-outline-success ${style.boton_login}`} onClick={handleLoginRedirect}>Regístrate/Inicia Sesión</button>
                                    <button type="button" className={`btn btn-outline-success ${style.boton_vender}`} onClick={handleVenderClick}>
                                        <i className={`bi bi-plus-circle`}></i> Vende
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Modal de Crear Anuncio */}
            <CrearAnuncio show={showModal} onClose={handleCloseModal} />

            {/* Modal de Inicio de Sesión */}
            <Modal show={showLoginModal} onHide={handleCloseLoginModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Inicio de Sesión Requerido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Para poder crear un anuncio, necesitas tener una cuenta e iniciar sesión.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button className={`btn btn-outline-success ${style.boton_vender}`} onClick={handleLoginRedirect}>
                        Iniciar Sesión
                    </Button>
                    <Button className={`btn btn-outline-success ${style.boton_cancelar}`} onClick={handleCloseLoginModal}>
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Header;
