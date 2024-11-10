import style from '../styles/SidebarCarrito.module.css';
import { Card } from 'react-bootstrap';

// eslint-disable-next-line react/prop-types
const SidebarCarrito = ({ titulo, precio }) => {
    return (
        <>
        <div className={`container ${style.main_container}`}>
            <h3 className={``}>Carrito</h3>
            <div className={`row`}>
                <div className={`container ${style.container_card}`}>
                    <Card className={style.card}>
                        <Card.Body>
                            <Card.Text>
                                {titulo}
                            </Card.Text>
                            <Card.Text>
                                <strong>{precio}€</strong>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
        </>
    );
};

export default SidebarCarrito