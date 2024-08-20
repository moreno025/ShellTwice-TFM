import { useEffect, useState } from 'react';
import Category from './Category';
import { Container, Row, Col } from 'react-bootstrap';
import style from '../styles/CategoriaList.module.css';

const CategoriaList = () => {

    const [categorias, setCategorias] = useState([]);
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('http://localhost:3001/categoria/list-categorias');
                const data = await response.json();
                setCategorias(data);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };
        fetchCategorias();
    }, []);

    return (
        <>
            <Container className={style.category_container}>
                <h3>Descubre nuestras categorías</h3>
                <Row className={style.row_container}>
                    {categorias.map((categoria) => {
                        const imagenCompleta = `http://localhost:3001${categoria.imagen}`;
                        return (
                            <Col key={categoria._id} xs={12} sm={6} md={4} lg={3}>
                                <Category titulo={categoria.titulo} imagen={imagenCompleta} />
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </>
    );
};

export default CategoriaList;
