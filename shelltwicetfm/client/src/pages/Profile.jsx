import { useState, useEffect } from 'react';
import { Tab, Tabs, Button, Row, Col, ListGroup, Card, Modal, Toast, ToastContainer } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import '../styles/Profile.module.css';

const Profile = () => {
    const { userId } = useAuth();
    const [favoritos, setFavoritos] = useState([]);
    const [articulosVendidos, setArticulosVendidos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [articuloAEliminar, setArticuloAEliminar] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

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

        if (userId) {
            obtenerFavoritos();
            obtenerArticulosVendidos();
        }
    }, [userId]);

    const handleEliminarClick = (articuloId) => {
        setArticuloAEliminar(articuloId);
        setShowModal(true);
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
                setTimeout(() => setShowToast(false), 2000);
                console.log('Artículo eliminado correctamente');
            } else {
                console.error('Error al eliminar el artículo:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la petición de eliminar artículo:', error);
        }
        setShowModal(false);
    };

    const handleEditar = () => {
        
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
                                    <Col key={favorito._id} xs={12} sm={6} md={4} className="mb-4">
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
                                                <Card.Text>
                                                    <strong>Ubicación:</strong> {favorito.ubicacion}
                                                </Card.Text>
                                                <Card.Text>
                                                    <strong>Categoría:</strong> {favorito.categoria?.titulo}
                                                </Card.Text>
                                                <Button variant="primary">Ver Detalles</Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <p>No tienes artículos en favoritos.</p>
                            )}
                        </Row>
                    </Tab>
                    <Tab eventKey="vendidos" title="Artículos Publicados">
                        <ListGroup>
                            {articulosVendidos.length > 0 ? (
                                articulosVendidos.map((articulo) => (
                                    <ListGroup.Item
                                        key={articulo._id}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <div>
                                            <strong>{articulo.titulo}</strong> - ${articulo.precio} - {articulo.estado}
                                        </div>
                                        <div>
                                            <Button
                                                variant="warning"
                                                className="me-2"
                                                onClick={() => handleEditar(articulo._id)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleEliminarClick(articulo._id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <p>No has publicado ningún artículo.</p>
                            )}
                        </ListGroup>
                    </Tab>
                </Tabs>
            </div>

            {/* Modal de confirmación */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Seguro de que deseas eliminar este artículo?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleEliminarConfirmado}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Toast de éxito */}
            <ToastContainer position="bottom-end" className="p-3">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={2000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Aviso artículo</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Footer />
        </>
    );
};

export default Profile;
