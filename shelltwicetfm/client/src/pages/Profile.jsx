import { useState, useEffect } from 'react';
import { Tab, Tabs, Button, Row, Col, Card, Modal, Toast, ToastContainer, Form } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import styles from '../styles/Profile.module.css';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { userId } = useAuth();
    const [favoritos, setFavoritos] = useState([]);
    const [articulosVendidos, setArticulosVendidos] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [articuloAEliminar, setArticuloAEliminar] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [articuloId, setArticuloId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Estados del formulario
    const [titulo, setTitulo] = useState('');
    const [precio, setPrecio] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [etiquetas, setEtiquetas] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [foto, setFoto] = useState(null);

    // Estados para la información del usuario
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [estado, setEstado] = useState('');

    // Estados para las valoraciones del usuario
    const [valoraciones, setValoraciones] = useState([]); 
    const [mediaValoracion, setMediaValoracion] = useState(null);


    useEffect(() => {
        const obtenerFavoritos = async () => {
            try {
                const response = await fetch('http://localhost:3001/users/favoritos', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setFavoritos(data);
                } else {
                    console.error('Error al obtener favoritos:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener favoritos:', error);
            }
        };

        const obtenerArticulosVendidos = async () => {
            try {
                const response = await fetch(`http://localhost:3001/articulo/usuario/${userId}`);
                if (response.ok) {
                    if (response.status !== 204) {
                        const data = await response.json();
                        setArticulosVendidos(data);
                    } else {
                        setArticulosVendidos([]);
                    }
                } else {
                    console.error('Error al obtener artículos vendidos:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener artículos vendidos:', error);
            }
        };

        const obtenerCategorias = async () => {
            try {
                const response = await fetch('http://localhost:3001/categoria/list-categorias');
                if (response.ok) {
                    const data = await response.json();
                    setCategorias(data);
                } else {
                    console.error('Error al obtener categorías:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la petición de obtener categorías:', error);
            }
        };

        const obtenerInfoUsuario = async () => {
            try {
                const response = await fetch('http://localhost:3001/users/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    setUsername(userData.username || '');
                    setName(userData.name || '');
                    setEmail(userData.email || '');
                    setEstado(userData.estado || '');
                } else {
                    console.error('Error al obtener la información del usuario:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la petición de obtener información del usuario:', error);
            }
        };

        const fetchValoraciones = async () => {
            try {
                const response = await fetch(`http://localhost:3001/valoracion`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
        
                if (response.ok) {
                    const data = await response.json();
                    setValoraciones(data);
                } else {
                    console.error('Error al obtener valoraciones:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        const fetchMediaValoracion = async () => {
            try {
                const response = await fetch(`http://localhost:3001/valoracion/media`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
        
                if (response.ok) {
                    const data = await response.json();
                    setMediaValoracion(data.media);
                } else {
                    console.error('Error al obtener la media de valoración:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };
    

        if (userId) {
            obtenerFavoritos();
            obtenerArticulosVendidos();
            obtenerCategorias();
            obtenerInfoUsuario();
            fetchMediaValoracion();
            fetchValoraciones();
        }
    }, [userId]);

    const handleEliminarClick = (articuloId) => {
        setArticuloAEliminar(articuloId);
        setShowDeleteModal(true);
    };

    const handleEliminarConfirmado = async () => {
        if (!articuloAEliminar) return;

        try {
            const response = await fetch(`http://localhost:3001/articulo/borrarArticulo/${articuloAEliminar}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                setArticulosVendidos(prev => prev.filter(articulo => articulo._id !== articuloAEliminar));
                setToastMessage('El anuncio del artículo se ha borrado exitosamente');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } else {
                console.error('Error al eliminar el artículo:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la petición de eliminar artículo:', error);
        }
        setShowDeleteModal(false);
    };

    const handleEditar = async (articuloId) => {
        try {
            const response = await fetch(`http://localhost:3001/articulo/${articuloId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const articulo = await response.json();

                setTitulo(articulo.titulo || '');
                setPrecio(articulo.precio || '');
                setDescripcion(articulo.descripcion || '');
                setUbicacion(articulo.ubicacion || '');
                setEtiquetas(Array.isArray(articulo.etiquetas) ? articulo.etiquetas.join(', ') : '');
                setCategoriaSeleccionada(articulo.categoria?._id || '');
                setArticuloId(articulo._id);
                setShowEditModal(true);
            } else {
                console.error('Error al obtener los datos del artículo');
            }
        } catch (error) {
            console.error('Error en la petición de obtener artículo:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!articuloId) {
            console.error('No hay ID de artículo disponible para actualizar');
            return;
        }
    
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('precio', precio);
        formData.append('descripcion', descripcion);
        formData.append('ubicacion', ubicacion);
    
        if (etiquetas.length > 0) {
            etiquetas.split(',').forEach((etiqueta, index) => {
                formData.append(`etiquetas[${index}]`, etiqueta.trim());
            });
        }
        formData.append('categoria', categoriaSeleccionada);
        if (foto) {
            formData.append('foto', foto);
        }
    
        try {
            const response = await fetch(`http://localhost:3001/articulo/actualizarArticulo/${articuloId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (response.ok) {
                const updatedArticulo = await response.json();
                setArticulosVendidos(prevArticulos =>
                    prevArticulos.map(articulo =>
                        articulo._id === articuloId
                            ? { ...articulo, ...updatedArticulo.articulo }
                            : articulo
                    )
                );

                setShowEditModal(false);
                setToastMessage('El artículo ha sido actualizado exitosamente.');
                setShowToast(true);
            } else {
                const errorData = await response.json();
                console.error('Error al actualizar el artículo:', errorData.message);
                setToastMessage('Hubo un error al actualizar el artículo.');
                setShowToast(true);
            }
        } catch (error) {
            console.error('Error en la petición de actualizar artículo:', error);
            setToastMessage('Error de red al actualizar el artículo.');
            setShowToast(true);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
    
        const updatedUserData = {
            username,
            name,
            email,
            estado,
        };
    
        try {
            const response = await fetch(`http://localhost:3001/users/actualizarUsuario/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedUserData),
            });
    
            if (response.ok) {
                setToastMessage('Datos actualizados exitosamente.');
                setShowToast(true);
                setIsEditing(false);
            } else {
                const errorData = await response.json();
                console.error('Error al actualizar el perfil:', errorData.message);
                setToastMessage('Hubo un error al actualizar los datos.');
                setShowToast(true);
            }
        } catch (error) {
            console.error('Error en la petición de actualización de perfil:', error);
            setToastMessage('Error de red al actualizar los datos.');
            setShowToast(true);
        }
    };
    

    return (
        <>
            <Header />
            <div className="container mt-5 mb-5">
                <h2>Perfil del Usuario</h2>
                <Tabs defaultActiveKey="favoritos" id="perfil-usuario-tabs" className="mb-3 mt-3">
                    <Tab eventKey="favoritos" title="Favoritos">
                        <Row>
                            {favoritos.length > 0 ? (
                                favoritos.map((favorito) => (
                                    <Col key={`favorito-${favorito._id}`} xs={12} sm={6} md={4} className="mb-4">
                                        <Link to={`/articulo/${favorito._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Card>
                                                <Card.Img
                                                    variant="top"
                                                    src={`http://localhost:3001${favorito.imagen}`}
                                                    alt={favorito.titulo}
                                                    style={{ height: '150px', objectFit: 'cover' }}
                                                />
                                                <Card.Body>
                                                    <Card.Title>{favorito.titulo}</Card.Title>
                                                    <Card.Text>
                                                        <strong>Precio:</strong> ${favorito.precio}
                                                    </Card.Text>
                                                    <Button className={styles.boton_detalles} variant="primary">Ver detalles</Button>
                                                </Card.Body>
                                            </Card>
                                        </Link>
                                    </Col>
                                ))
                            ) : (
                                <p>No tienes artículos en favoritos</p>
                            )}
                        </Row>
                    </Tab>

                    <Tab eventKey="vendidos" title="Mis artículos">
                        <Row>
                            {articulosVendidos.length > 0 ? (
                                articulosVendidos.map((articulo) => (
                                    <Col key={`articulo-${articulo._id}`} xs={12} sm={6} md={4} className="mb-4">
                                        <Link to={`/articulo/${articulo._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Card>
                                                <Card.Img
                                                    variant="top"
                                                    src={`http://localhost:3001${articulo.imagen}`}
                                                    alt={articulo.titulo}
                                                    style={{ height: '150px', objectFit: 'cover' }}
                                                />
                                                <Card.Body>
                                                    <Card.Title>{articulo.titulo}</Card.Title>
                                                    <Card.Text>
                                                        <strong>Precio:</strong> ${articulo.precio}
                                                    </Card.Text>
                                                    <Card.Text>
                                                        <strong>Estado:</strong> {articulo.estado}
                                                    </Card.Text>
                                                    <Button variant="warning" onClick={(e) => { e.stopPropagation(); handleEditar(articulo._id); }}>
                                                        Editar
                                                    </Button>
                                                    <Button variant="danger" className="ms-2" onClick={(e) => { e.stopPropagation(); handleEliminarClick(articulo._id); }}>
                                                        Eliminar
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Link>
                                    </Col>
                                ))
                            ) : (
                                <p>No tienes artículos vendidos</p>
                            )}
                        </Row>
                    </Tab>
                    <Tab eventKey="perfil" title="Mis Datos">
                        {isEditing ? (
                            <Form onSubmit={handleProfileSubmit}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formUsername" className="mt-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formEmail" className="mt-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formStatus" className="mt-3">
                                    <Form.Label>Estado</Form.Label>
                                    <div className='mb-3'>
                                        <Form.Check
                                            inline
                                            label="Activo"
                                            type="radio"
                                            name="status"
                                            id="statusActivo"
                                            value="Activo"
                                            checked={estado === 'Activo'}
                                            onChange={() => setEstado('Activo')}
                                            className={styles.custom_radio_bootstrap}
                                        />
                                        <Form.Check
                                            inline
                                            label="Inactivo"
                                            type="radio"
                                            name="status"
                                            id="statusInactivo"
                                            value="Inactivo"
                                            checked={estado === 'Inactivo'}
                                            onChange={() => setEstado('Inactivo')}
                                            className={styles.custom_radio_bootstrap}
                                        />
                                    </div>
                                </Form.Group>
                                <Button type="submit" className={styles.boton_detalles}>Guardar cambios</Button>
                            </Form>
                        ) : (
                            <Form>
                                <Form.Group controlId="formName">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" value={name} readOnly />
                                </Form.Group>

                                <Form.Group controlId="formUsername" className="mt-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" value={username} readOnly />
                                </Form.Group>

                                <Form.Group controlId="formEmail" className="mt-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={email} readOnly />
                                </Form.Group>

                                <Form.Group controlId="formStatus" className="mt-3 mb-3">
                                    <Form.Label>Estado</Form.Label>
                                    <div>
                                        <Form.Check
                                            inline
                                            label="Activo"
                                            type="radio"
                                            name="status"
                                            id="statusActivo"
                                            value="Activo"
                                            checked={estado === 'Activo'}
                                            className={styles.custom_radio_bootstrap}
                                            readOnly
                                        />
                                        <Form.Check
                                            inline
                                            label="Inactivo"
                                            type="radio"
                                            name="status"
                                            id="statusInactivo"
                                            value="Inactivo"
                                            checked={estado === 'Inactivo'}
                                            className={styles.custom_radio_bootstrap}
                                            readOnly
                                        />
                                    </div>
                                </Form.Group>
                            </Form>
                        )}
                        
                        <Button onClick={() => setIsEditing(!isEditing)} className={styles.boton_detalles}>
                            {isEditing ? 'Cancelar' : 'Editar perfil'}
                        </Button>
                    </Tab>
                    <Tab eventKey="valoraciones" title="Mi Valoración">
                        <Row>
                            <h5>Valoración media</h5>
                            {mediaValoracion !== null ? (
                                <p>Tu nota es de: {mediaValoracion.toFixed(1)} ★</p>
                            ) : (
                                <p>Cargando media de valoración...</p>
                            )}
                            {valoraciones.length > 0 ? (
                                valoraciones.map((valoracion) => (
                                    <Col key={`valoracion-${valoracion._id}`} xs={12} sm={6} md={4} className="mb-4">
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Valorado por: {valoracion.valorado_por.username}</Card.Title>
                                                <Card.Text>
                                                    <strong>Calificación:</strong> {valoracion.calificacion} ★
                                                </Card.Text>
                                                {valoracion.comentario && (
                                                    <Card.Text>
                                                        <strong>Comentario:</strong> {valoracion.comentario}
                                                    </Card.Text>
                                                )}
                                                <Card.Text>
                                                    <small>Fecha: {new Date(valoracion.createdAt).toLocaleDateString()}</small>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <p>No tienes valoraciones recibidas.</p>
                            )}
                        </Row>
                    </Tab>
                </Tabs>
            </div>

            {/* Modal de eliminación */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Estás seguro de que deseas eliminar este artículo?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleEliminarConfirmado}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de edición */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar artículo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formTitulo">
                            <Form.Label>Título</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Título"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPrecio">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Precio"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescripcion">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Descripción"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formUbicacion">
                            <Form.Label>Ubicación</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ubicación"
                                value={ubicacion}
                                onChange={(e) => setUbicacion(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formEtiquetas">
                            <Form.Label>Etiquetas (separadas por comas)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Etiquetas"
                                value={etiquetas}
                                onChange={(e) => setEtiquetas(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formCategoria" className="mt-3">
                            <Form.Label>Categoría</Form.Label>
                            {categorias.length > 0 ? (
                                categorias.map((categoria) => (
                                    <Form.Check
                                        key={categoria._id}
                                        type="radio"
                                        label={categoria.titulo}
                                        value={categoria._id}
                                        checked={categoriaSeleccionada === categoria._id}
                                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                                        className={styles.custom_radio_bootstrap}
                                        required
                                    />
                                ))
                            ) : (
                                <p>Cargando categorías...</p>
                            )}
                        </Form.Group>

                        <Form.Group controlId="formFoto">
                            <Form.Label>Foto</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setFoto(e.target.files[0])}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Guardar cambios
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Toast de confirmación */}
            <ToastContainer position="bottom-center" className="mb-3">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Footer />
        </>
    );
};

export default Profile;
