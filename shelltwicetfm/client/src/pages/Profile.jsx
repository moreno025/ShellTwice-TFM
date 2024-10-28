import { useState, useEffect } from 'react';
import { Tab, Tabs, Button, Row, Col, Card, Modal, Toast, ToastContainer, Form } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import styles from '../styles/Profile.module.css';

const Profile = () => {
    const { userId } = useAuth();
    const [favoritos, setFavoritos] = useState([]);
    const [articulosVendidos, setArticulosVendidos] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal para eliminar
    const [showEditModal, setShowEditModal] = useState(false);    // Modal para editar
    const [articuloAEliminar, setArticuloAEliminar] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [articuloId, setArticuloId] = useState(null);

    // Estados del formulario
    const [titulo, setTitulo] = useState('');
    const [precio, setPrecio] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [etiquetas, setEtiquetas] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [foto, setFoto] = useState(null);

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

        if (userId) {
            obtenerFavoritos();
            obtenerArticulosVendidos();
            obtenerCategorias();
        }
    }, [userId]);

    const handleEliminarClick = (articuloId) => {
        setArticuloAEliminar(articuloId);
        setShowDeleteModal(true);  // Usamos el modal de eliminación
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

    return (
        <>
            <Header />
            <div className="container mt-5 mb-5">
                <h2>Perfil del Usuario</h2>
                <Tabs defaultActiveKey="favoritos" id="perfil-usuario-tabs" className="mb-3">
                    <Tab eventKey="favoritos" title="Favoritos">
                        <Row>
                            {favoritos.length > 0 ? (
                                favoritos.map((favorito) => (
                                    <Col key={`favorito-${favorito._id}`} xs={12} sm={6} md={4} className="mb-4">
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
                                                <Button className = {styles.boton_detalles} variant="primary">Ver detalles</Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <p>No tienes artículos en favoritos</p>
                            )}
                        </Row>
                    </Tab>

                    <Tab eventKey="vendidos" title="Mis artículos vendidos">
                        <Row>
                            {articulosVendidos.length > 0 ? (
                                articulosVendidos.map((articulo) => (
                                    <Col key={`articulo-${articulo._id}`} xs={12} sm={6} md={4} className="mb-4">
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
                                                <Button
                                                    variant="warning"
                                                    onClick={() => handleEditar(articulo._id)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    className="ms-2"
                                                    onClick={() => handleEliminarClick(articulo._id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <p>No tienes artículos vendidos</p>
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
