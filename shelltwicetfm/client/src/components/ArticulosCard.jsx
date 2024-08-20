import Card from 'react-bootstrap/Card';
import style from '../styles/ArticulosCard.module.css';

// eslint-disable-next-line react/prop-types
const ArticuloCard = ({ titulo, descripcion, precio, imagen }) => {
    return (
        <Card className={`mb-3 ${style.card_container}`} style={{ maxWidth: '650px' }}>
            <div className={`row g-0`}>
                <div className={`col-md-4`}>
                    <Card.Img variant="top" src={imagen} alt={titulo} className={`img-fluid rounded-start ${style.card_img}`} />
                </div>
                <div className={`col-md-8`}>
                    <Card.Body>
                        <Card.Title>{titulo}</Card.Title>
                        <Card.Text>{descripcion}</Card.Text>
                        <Card.Text>
                            <strong>Precio:</strong> {precio}€
                        </Card.Text>
                    </Card.Body>
                </div>
            </div>
        </Card>
    );
};

export default ArticuloCard;
