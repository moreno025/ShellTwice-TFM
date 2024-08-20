import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import ArticuloCard from './ArticulosCard';
import style from '../styles/ArticulosList.module.css';

const ArticulosList = () => {
    const { titulo } = useParams();
    const [articulos, setArticulos] = useState([]);

    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                const response = await fetch(`http://localhost:3001/articulo/categorias/${titulo}`);
                if (response.ok) {
                    const data = await response.json();
                    setArticulos(data);
                } else {
                    console.error('Error al obtener los artículos:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener los artículos:', error);
            }
        };
        fetchArticulos();
    }, [titulo]);

    return (
        <Container className={style.container_list}>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>{titulo}</Breadcrumb.Item>
            </Breadcrumb>
            <h3>Anuncios en la categoría: {titulo}</h3>
            <Row>
                {articulos.map((articulo) => {
                    return (
                        <Col key={articulo._id} xs={12} sm={6} md={4}>
                            <ArticuloCard
                                key={articulo._id}
                                imagen={`http://localhost:3001${articulo.imagen}`}
                                titulo={articulo.titulo}
                                descripcion={articulo.descripcion}
                                precio={articulo.precio}
                            />
                        </Col>
                    )
                })}
            </Row>
        </Container>
    );
};

export default ArticulosList;
