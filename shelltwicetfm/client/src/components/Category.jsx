import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import style from '../styles/Category.module.css';

// eslint-disable-next-line react/prop-types
const Category = ({ titulo, imagen }) => {
    return (
        <Link to={`/categorias/${titulo}`} className={style.link}>
        <Card className={style.container_card} style={{ width: '18rem' }}>
            <Card.Img variant="top" src={imagen} alt={titulo} className={style.card_img_top} />
            <Card.Body className={style.card_body}>
                <Card.Text className={style.card_text}>
                    {titulo}
                </Card.Text>
            </Card.Body>
        </Card>
        </Link>
    );
};

export default Category;
