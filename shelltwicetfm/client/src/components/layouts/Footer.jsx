import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import logo from '../../assets/logoEditado.png';
import style from '../../styles/Footer.module.css';

const Footer = () => {
    return (
        <footer className={`bg-dark text-white pt-4 mt-auto ${style.container_footer}`}>
        <Container>
            <Row>
            <Col md={4}>
                <a href='/'>
                    <img src={logo} alt="Logo" width="150" height="50" className={`d-inline-block align-text-top`} />
                </a>
            </Col>
            <Col md={4}>
                <h5>Visítanos!</h5>
                <ul className={`list-unstyled mt-3`}>
                    <li><p className={`text-white ${style.p_footer}`}>Calle Almendras, 45</p></li>
                    <li><p className={`text-white ${style.p_footer}`}>28014 Madrid</p></li>
                    <li><p className={`text-white ${style.p_footer}`}>Telf: +34 123 674 291</p></li>
                </ul>
            </Col>
            <Col md={4}>
                <h5>Síguenos en nuestras redes</h5>
                <ul className={`list-unstyled d-flex`}>
                <li className={`me-3`}>
                    <a href="#" className={`text-white`}>
                    <FaFacebook size={24} />
                    </a>
                </li>
                <li className={`me-3`}>
                    <a href="#" className={`text-white`}>
                    <FaTwitter size={24} />
                    </a>
                </li>
                <li className={`me-3`}>
                    <a href="#" className={`text-white`}>
                    <FaInstagram size={24} />
                    </a>
                </li>
                <li className={`me-3`}>
                    <a href="#" className={`text-white`}>
                    <FaLinkedin size={24} />
                    </a>
                </li>
                </ul>
            </Col>
            </Row>
            <hr className={`my-4`} />
            <Row>
            <Col className={`text-center`}>
                <p>&copy; 2024 ShellTwice. All rights reserved.</p>
            </Col>
            </Row>
        </Container>
        </footer>
    );
};

export default Footer;
