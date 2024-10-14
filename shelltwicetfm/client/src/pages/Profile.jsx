import { useState, useEffect } from 'react';
import { Tab, Tabs, Card, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import '../styles/Profile.module.css';

const Profile = () => {
    const { userId } = useAuth();
    const [favoritos, setFavoritos] = useState([]);
    const [articulosVendidos, setArticulosVendidos] = useState([]);

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

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2>Perfil del Usuario</h2>
                <Tabs defaultActiveKey="favoritos" id="perfil-usuario-tabs" className="mb-3">
                    {/* Pestaña de Favoritos */}
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

                    {/* Pestaña de Artículos Vendidos */}
                    <Tab eventKey="vendidos" title="Artículos Vendidos">
                        <Row>
                            {articulosVendidos.length > 0 ? (
                                articulosVendidos.map((articulo) => (
                                    <Col key={articulo._id} md={4} className="mb-4">
                                        <Card>
                                            <Card.Img
                                                variant="top"
                                                src={`http://localhost:3001${articulo.imagen}`}
                                                alt={articulo.titulo}
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <Card.Body>
                                                <Card.Title>{articulo.titulo}</Card.Title>
                                                <Card.Text>
                                                    <strong>Precio:</strong> ${articulo.precio}
                                                </Card.Text>
                                                <Card.Text>
                                                    <strong>Ubicación:</strong> {articulo.ubicacion}
                                                </Card.Text>
                                                <Button variant="primary">Ver Detalles</Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <p>No has vendido ningún artículo.</p>
                            )}
                        </Row>
                    </Tab>
                    {/* Puedes agregar más pestañas si lo deseas */}
                </Tabs>
            </div>
            <Footer />
        </>
    );
};

export default Profile;
