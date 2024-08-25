/* eslint-disable react/no-unescaped-entities */
import { Container, Row, Col } from 'react-bootstrap';
import ArticuloCard from '../components/ArticulosCard';
import { useLocation } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import style from '../styles/ArticulosList.module.css';

const Resultados = () => {
    const location = useLocation();
    const state = location.state || {};
    const articulos = state.articulos || [];

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('query');

    return (
        <>
        <Header />
        <Container className={style.container_list}>
            <h3>Resultados de '{searchQuery}'</h3>
            <Row>
                {articulos.length > 0 ? (
                    articulos.map((articulo) => (
                        <Col key={articulo._id} xs={12} sm={6} md={4}>
                            <ArticuloCard
                                _id={articulo._id}
                                imagen={`http://localhost:3001${articulo.imagen}`}
                                titulo={articulo.titulo}
                                descripcion={articulo.descripcion}
                                precio={articulo.precio}
                            />
                        </Col>
                    ))
                ) : (
                    <Col xs={12}>
                        <p>No se encontraron artículos.</p>
                    </Col>
                )}
            </Row>
        </Container>
        <Footer />
        </>
    );
};

export default Resultados;
