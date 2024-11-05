import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import { Tab, Tabs, Modal, Toast, Breadcrumb } from 'react-bootstrap';
//import SidebarCarrito from '../components/SidebarCarrito';
import { useAuth } from '../contexts/AuthContext';
import style from '../styles/ArticuloDetails.module.css';

const ArticuloDetails = () => {
    const { id } = useParams();
    const [articulo, setArticulo] = useState(null);
    const [isFavorito, setIsFavorito] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [actionType, setActionType] = useState('');
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const { isAuthenticated, userId } = useAuth();
    const [calificacion, setCalificacion] = useState(1);
    const [comentarioValoracion, setcomentarioValoracion] = useState("");

    const comentarioInputRef = useRef(null);
    const comentariosContainerRef = useRef(null);

    useEffect(() => {
        const fetchArticulo = async () => {
            try {
                const response = await fetch(`http://localhost:3001/articulo/${id}`);
                const data = await response.json();
                setArticulo(data);
                setComentarios(data.comentarios.reverse());
                if (isAuthenticated) {
                    const favResponse = await fetch(`http://localhost:3001/users/favoritos`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    const favoritos = await favResponse.json();
                    const esFavorito = favoritos.some(fav => fav._id === id);
                    setIsFavorito(esFavorito);
                }
            } catch (error) {
                console.error('Error al obtener el artículo:', error);
            }
        };
        fetchArticulo();
    }, [id, isAuthenticated]);
    

    const handleToggleFavorito = async () => {
        if (!isAuthenticated) {
            setActionType('favoritos');
            setShowModal(true);
            return;
        }
        try {
            const response = await fetch(`http://localhost:3001/users/favoritos/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            if (response.status === 403) {
                setShowModal(true);
                return;
            }
    
            if (response.ok) {
                const result = await response.json();
                setToastMessage(result.message);
                setIsFavorito(!isFavorito);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            } else {
                alert('Hubo un problema al actualizar favoritos.');
            }
        } catch (error) {
            console.error('Error al actualizar favoritos:', error);
            if (error.response) {
                console.error('Error de respuesta:', error.response.data);
            }
        }
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            setActionType('carrito');
            setShowModal(true);
            return;
        }
        setToastMessage('Artículo añadido al carrito');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleAgregarComentario = async () => {
        if (!nuevoComentario) return;
    
        try {
            const response = await fetch(`http://localhost:3001/articulo/${id}/comentario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    usuarioId: userId,
                    texto: nuevoComentario,
                }),
            });
    
            if (response.ok) {
                const data = await response.json();

                const nuevoComentarioObj = data;
                if (nuevoComentarioObj && Array.isArray(comentarios)) {
                    setComentarios([nuevoComentarioObj, ...comentarios]);
                    setNuevoComentario("");
                    comentarioInputRef.current?.focus();

                    if (comentariosContainerRef.current) {
                        comentariosContainerRef.current.scrollTop = 0;
                    }
                } else {
                    console.error("La estructura de datos no es la esperada:", data);
                }
            } else {
                console.error('Error al añadir comentario');
            }
        } catch (error) {
            console.error('Error al enviar el comentario:', error);
        }
    };

    // Función para añadir valoración
    const handleAgregarValoracion = async () => {
        if (!isAuthenticated) {
            setActionType('valoracion');
            setShowModal(true);
            return;
        }
        try {
            const response = await fetch(`http://localhost:3001/valoracion/usuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    usuarioId: articulo.usuario_id,
                    valoradoPor: userId,
                    calificacion: calificacion,
                    comentario: comentarioValoracion
                }),
            });

            if (response.ok) {
                // eslint-disable-next-line no-unused-vars
                const data = await response.json();
                setCalificacion(1);
                setcomentarioValoracion("");
            } else {
                console.error('Error al añadir valoración:', response.statusText);
            }
        } catch (error) {
            console.error('Error al enviar la valoración:', error);
        }
    };

    if (!articulo) return <p>Cargando...</p>;

    return (
        <>
            <Header />
            <div className={`container mb-4`}>
                <div className={`row justify-content-center align-items-center`} style={{ minHeight: '70vh' }}>
                    <div className={`col-sm-8 col-md-8`}>
                        <Breadcrumb className={`mt-4`}>
                            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                                Home
                            </Breadcrumb.Item>
                            <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/categorias/${articulo.categoria.titulo}` }}>
                                {articulo.categoria.titulo}
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>
                                {articulo.titulo}
                            </Breadcrumb.Item>
                        </Breadcrumb>
                        <div className={`card`} style={{ maxWidth: '800px' }}>
                            <img src={`http://localhost:3001${articulo.imagen}`} alt={articulo.titulo} className={`img-fluid rounded-start ${style.card_img}`} />
                            <div className={`card-body ${style.body_container}`}>
                                <h3 className={`card-title text-center`}>{articulo.titulo}</h3>
                                <h5><strong>Precio:</strong> {articulo.precio}€</h5>
                                <p className={`card-text`}>{articulo.descripcion}</p>
                                <i className={`bi bi-geo-alt-fill`} style={{ color: 'red' }}></i> {articulo.ubicacion}
                                <hr />
                                <div className={style.etiquetas_container}>
                                    {articulo.etiquetas.map((etiqueta, index) => (
                                        <button
                                            key={index}
                                            className={`btn ${style.boton_etiquetas} m-1`}
                                        >
                                            {etiqueta}
                                        </button>
                                    ))}
                                </div>
                                <hr />
                                <h5>Detalles de la entrega</h5>
                                <i className={`bi bi-truck`} style={{ color: 'purple' }}> Envíos a todas partes de España</i><br />
                                <i className={`bi bi-box-seam`} style={{ color: 'green' }}> Entregas de 2-3 días laborables</i><hr />
                                <p><small className={`text-body-secondary`}>Última actualización: {new Date(articulo.updatedAt).toLocaleDateString()}</small></p><hr />
                                <div className={`container d-flex gap-2 ${style.container_botones}`}>
                                    <button 
                                        type='submit' 
                                        className={`btn ${style.boton_comprar}`}
                                        onClick={handleAddToCart}
                                    >
                                        <i className={`bi bi-cart-check-fill`} style={{ fontSize: '25px' }}></i>
                                    </button>
                                    <button
                                        type="submit"
                                        className={`btn ${isFavorito ? style.boton_favoritos_active : style.boton_favoritos}`}
                                        onClick={handleToggleFavorito}
                                    >
                                        <i className={`bi bi-heart-fill`} style={{ fontSize: '25px' }}></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Formulario para añadir un comentario */}
                        <Tabs defaultActiveKey="comentarios" className="mb-3 mt-5">
                            <Tab eventKey="comentarios" title="Comentarios">
                                <div className={`pt-3 p-2 mt-3`} style={{ maxWidth: '800px', backgroundColor: 'white', borderRadius: '10px'}}>
                                    {isAuthenticated && (
                                        <div className="input-group mb-3">
                                            <input
                                                ref={comentarioInputRef}
                                                value={nuevoComentario}
                                                onChange={(e) => setNuevoComentario(e.target.value)}
                                                className="form-control"
                                                placeholder="Escribe un comentario..."
                                                rows="3"
                                            />
                                            <button type="submit" className={`btn btn-primary ${style.boton_comentario}`} onClick={handleAgregarComentario}>
                                                <i className="bi bi-send"></i>
                                            </button>
                                        </div>
                                    )}
                                    {!isAuthenticated && (
                                        <div className="input-group mb-3">
                                            <input
                                                className="form-control"
                                                placeholder="Inicia sesión para agregar comentarios."
                                                rows="3"
                                            />
                                            <button type="submit" className={`btn btn-primary ${style.boton_comentario}`} disabled>
                                                <i className="bi bi-send"></i>
                                            </button>
                                        </div>
                                    )}
                                    {/* Sección de comentarios */}
                                    <div ref={comentariosContainerRef} className="mb-3 mt-4" style={{ maxWidth: '800px', maxHeight: '400px', overflowY: 'auto' }}>
                                        {comentarios.map((comentario, index) => (
                                            <div key={index} className="mb-2 p-2 border rounded">
                                                <strong>
                                                    {comentario.usuario && comentario.usuario.username 
                                                        ? comentario.usuario.username 
                                                        : 'Unknown'}
                                                    :
                                                </strong>
                                                {comentario.texto}
                                                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                    {new Date(comentario.fecha).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="valoracion" title="Valoración">
                                <h5>Valora este usuario</h5>
                                <div className="d-flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            onClick={() => setCalificacion(star)}
                                            style={{
                                                cursor: 'pointer',
                                                color: star <= calificacion ? 'gold' : 'gray',
                                                fontSize: '24px',
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                {/* Campo para el comentario */}
                                <textarea
                                    value={comentarioValoracion}
                                    onChange={(e) => setcomentarioValoracion(e.target.value)}
                                    placeholder="Deja un comentario (opcional)"
                                    rows="3"
                                    className="form-control my-2"
                                />
                                {/* Botón para enviar la valoración */}
                                <button className="btn btn-primary" onClick={handleAgregarValoracion}>
                                    Enviar
                                </button>
                            </Tab>
                        </Tabs>
                    </div>
                    {/*<div className={`col-4 col-md-4`}>
                    <SidebarCarrito titulo={articulo.titulo} precio={articulo.precio} />
                    </div>*/}
                    </div>
                </div>

            {/* Modal para usuarios no autenticados */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>No estás autenticado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Para {actionType === 'carrito' ? 'añadir el artículo al carrito' : actionType === 'favoritos' ? 'añadir el artículo a tus favoritos' : 'vender el artículo'}, por favor inicia sesión o regístrate.</p>
                    <div className="d-flex justify-content-end">
                        <Link to="/login" className={`btn btn-primary me-2 ${style.boton_sesion}`}>Iniciar Sesión</Link>
                        <Link to="/signup" className={`btn ${style.boton_comprar}`}>Registrarse</Link>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Toast de confirmación */}
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 1000,
                }}
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
            <Footer />
        </>
    );
};

export default ArticuloDetails;
