import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import ArticuloCard from '../components/ArticulosCard';
import { useLocation } from 'react-router-dom';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import FiltrosBusqueda from '../components/FiltrosBusqueda';
import style from '../styles/Resultados.module.css';

const Resultados = () => {
    const location = useLocation();
    const [articulos, setArticulos] = useState([]);
    const [articulosFiltrados, setArticulosFiltrados] = useState([]);
    const [filtros, setFiltros] = useState({
        precioMin: '',
        precioMax: '',
        categoria: '',
    });

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('query');

    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                const response = await fetch(`http://localhost:3001/articulo/buscar?query=${encodeURIComponent(searchQuery)}`);
                const result = await response.json();
                setArticulos(result.articulos);
                setArticulosFiltrados(result.articulos);
            } catch (error) {
                console.error('Error al buscar:', error);
            }
        };
        fetchArticulos();
    }, [searchQuery]);

    useEffect(() => {
        let filtrados = articulos;

        if (filtros.precioMin) {
            filtrados = filtrados.filter(articulo => articulo.precio >= Number(filtros.precioMin));
        }
        if (filtros.precioMax) {
            filtrados = filtrados.filter(articulo => articulo.precio <= Number(filtros.precioMax));
        }
        if (filtros.categoria) {
            filtrados = filtrados.filter(articulo => articulo.categoria === filtros.categoria);
        }

        setArticulosFiltrados(filtrados);
    }, [filtros, articulos]);

    const handleFilterChange = (newFiltros) => {
        setFiltros(newFiltros);
    };

    return (
        <>
            <Header />
            <Container fluid className={style.container}>
                <Row>
                    {/* Sidebar con filtros */}
                    <Col md={2} className={style.container_input}>
                        <FiltrosBusqueda onFilterChange={handleFilterChange} />
                    </Col>
                    <Col md={9}>
                        <h3>Resultados de '{searchQuery}'</h3>
                        <Row>
                            {articulosFiltrados.length > 0 ? (
                                articulosFiltrados.map((articulo) => (
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
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default Resultados;
