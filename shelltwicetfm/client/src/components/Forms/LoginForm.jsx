import { useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import styles from '../../styles/SignUp.module.css';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3001/users/login', {
                username: formData.usernameOrEmail,
                email: formData.usernameOrEmail,
                password: formData.password,
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                // Redirige a la página principal
                window.location.href = '/';
            } else {
                showModalMessage('Error al iniciar sesión');
            }
        } catch (error) {
            showModalMessage('Vaya! Las credenciales son incorrectas...');
        } finally {
            setLoading(false);
        }
    };

    const showModalMessage = (message) => {
        setError(message);
        setShowModal(true);
        setTimeout(() => {
            setShowModal(false);
        }, 2000); // 2 segundos
    };

    return (
        <div className={`col`}>
            <div className={`p-3`}>
                <div className={`card ${styles.card_right}`}>
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={`form-floating mb-3 mt-4`}>
                            <input
                                type="text"
                                className={`form-control`}
                                name="usernameOrEmail"
                                value={formData.usernameOrEmail}
                                onChange={handleChange}
                                placeholder="Username or Email"
                                required
                            />
                            <label htmlFor="usernameOrEmail">Username or Email</label>
                        </div>
                        <div className={`form-floating mb-3`}>
                            <input
                                type="password"
                                className={`form-control`}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                            <label htmlFor="password">Password</label>
                        </div>
                        <button 
                            type="submit" 
                            className={`btn btn-primary mt-3 ${styles.boton_signup}`}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{error}</Modal.Body>
                <Modal.Footer>
                    <Button className={`btn btn-outline-danger ${styles.boton_cerrar}`} onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default LoginForm;
