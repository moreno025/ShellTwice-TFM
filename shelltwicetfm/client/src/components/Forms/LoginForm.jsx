import { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/SignUp.module.css';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Enviar datos al backend
            const response = await axios.post('http://localhost:3001/users/login', {
                username: formData.usernameOrEmail,
                email: formData.usernameOrEmail,
                password: formData.password,
            });

            // Manejar la respuesta
            if (response.status === 200) {
                alert('Inicio de sesión exitoso');
                // Guardar el token en el localStorage o gestionar la autenticación
                localStorage.setItem('token', response.data.token);
                // Redirigir o realizar otras acciones necesarias aquí
            } else {
                alert('Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            setError(error.response?.data?.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    return (
            <div className={`p-3`}>
                <div className={`card ${styles.card_right}`}>
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        {error && <p className={styles.error}>{error}</p>}
                        <div className="form-floating mb-3 mt-4">
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
                        <div className="form-floating mb-3">
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
    );
};

export default LoginForm;
