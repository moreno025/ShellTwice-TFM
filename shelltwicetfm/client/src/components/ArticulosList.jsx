import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import ArticuloCard from './ArticulosCard';
import FiltrosBusqueda from './FiltrosBusqueda';
import style from '../styles/ArticulosList.module.css';

const ArticulosList = () => {
    const { titulo } = useParams();
    const [articulos, setArticulos] = useState([]);
    const [articulosFiltrados, setArticulosFiltrados] = useState([]);
    const [filtros, setFiltros] = useState({
        precioMin: '',
        precioMax: '',
        categoria: '',
    });

    const handleFilterChange = (newFiltros) => {
        setFiltros(newFiltros);
    };

    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                const response = await fetch(`http://localhost:3001/articulo/categorias/${titulo}`);
                if (response.ok) {
                    const data = await response.json();
                    setArticulos(data);
                    setArticulosFiltrados(data); // Inicializar con todos los artículos
                } else {
                    console.error('Error al obtener los artículos:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener los artículos:', error);
            }
        };
        fetchArticulos();
    }, [titulo]);

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

    return (
        <Container fluid className={style.container_list}>
            <Row>
                {/* Sidebar con filtros */}
                <Col md={2} className={style.container_input}>
                    <FiltrosBusqueda onFilterChange={handleFilterChange} />
                </Col>
                {/* Lista de artículos */}
                <Col md={9}>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>{titulo}</Breadcrumb.Item>
                    </Breadcrumb>
                    <h3>Anuncios en la categoría: {titulo}</h3>
                    <Row>
                        {articulosFiltrados.length > 0 ? (
                            articulosFiltrados.map((articulo) => (
                                <Col key={articulo._id} xs={12} sm={6} md={4} className="mb-4">
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
    );
};

export default ArticulosList;
