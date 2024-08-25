import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import style from '../../styles/Header.module.css';
import logo from '../../assets/logoEditado.png';
import profilePic from '../../assets/fotoPerfil.jpg';

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const [showSidebar, setShowSidebar] = useState(false);
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

    const handleSearch = async (event) => {
        event.preventDefault();
    
        if (searchQuery.trim() !== '') {
            try {
                const response = await fetch(`http://localhost:3001/articulo/buscar?query=${encodeURIComponent(searchQuery)}`);
                if (!response.ok) {
                    throw new Error(`Error en la búsqueda: ${response.status} - ${response.statusText}`);
                }
                const result = await response.json();
                console.log(result);
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
                    {/* Logo */}
                    <a className={`navbar-brand ${style.container}`} href="/">
                        <img src={logo} alt="Logo" width="150" height="50" className={`d-inline-block align-text-top`} />
                    </a>

                    {/* Botón toggler para colapsar el navbar en pantallas pequeñas */}
                    <button className={`navbar-toggler`} type="button" onClick={toggleSidebar} aria-controls="offcanvasRight" aria-expanded={showSidebar} aria-label="Toggle navigation">
                        <span className={`navbar-toggler-icon`}></span>
                    </button>

                    {/* Contenido del navbar en pantallas grandes */}
                    <div className={`collapse navbar-collapse ${showSidebar ? 'show' : ''}`}>
                        {/* Formulario de búsqueda */}
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

                        {/* Botones de perfil o registro e inicio de sesión */}
                        <div className={`d-none d-lg-flex align-items-center`}>
                            {isAuthenticated ? (
                                <div className={`d-flex align-items-center`}>
                                    <img src={profilePic} alt="Perfil" className={`rounded-circle me-2 ${style.profile_pic}`} style={{ width: '40px', height: '40px' }} />
                                    <span className={`me-3`} onClick={handleProfileRedirect} style={{ cursor: 'pointer' }}>Mi Perfil</span>
                                    <button type="button" className={`btn btn-outline-success ${style.boton_vender}`}>
                                        <i className={`bi bi-plus-circle`}></i> Vende
                                    </button>
                                    <button type="button" className={`btn btn-outline-success ${style.boton_login}`} onClick={handleLogout}>Cerrar Sesión</button>
                                </div>
                            ) : (
                                <>
                                    <button type="button" className={`btn btn-outline-success ${style.boton_login}`} onClick={handleLoginRedirect}>Regístrate/Inicia Sesión</button>
                                    <button type="button" className={`btn btn-outline-success ${style.boton_vender}`}>
                                        <i className={`bi bi-plus-circle`}></i> Vende
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar Offcanvas */}
            <div className={`offcanvas offcanvas-end ${showSidebar ? 'show' : ''}`} tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div className={`offcanvas-header`}>
                    <h5 id="offcanvasRightLabel">ShellTwice Menú</h5>
                    <button type="button" className={`btn-close`} onClick={toggleSidebar} aria-label="Close"></button>
                </div>
                <div className={`offcanvas-body`}>
                    {/* Formulario de búsqueda en el sidebar */}
                    <form className={`d-flex mb-3`} role="search" onSubmit={handleSearch}>
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

                    {/* Botones de perfil o registro e inicio de sesión en el sidebar */}
                    <div className={`d-flex flex-column`}>
                        {isAuthenticated ? (
                            <div className={`d-flex align-items-center mb-2`}>
                                <img src={profilePic} alt="Perfil" className={`rounded-circle me-2 ${style.profile_pic}`} style={{ width: '40px', height: '40px' }} />
                                <span className={`me-3`} onClick={handleProfileRedirect} style={{ cursor: 'pointer' }}>Mi Perfil</span>
                                <button type="button" className={`btn btn-outline-success ${style.boton_login_side}`} onClick={handleLogout}>Cerrar Sesión</button>
                            </div>
                        ) : (
                            <>
                                <button type="button" className={`btn btn-outline-success ${style.boton_login_side}`} onClick={handleLoginRedirect}>Regístrate/Inicia Sesión</button>
                                <button type="button" className={`btn btn-outline-success ${style.boton_vender_side}`}>
                                    <i className={`bi bi-plus-circle`}></i> Vende
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
