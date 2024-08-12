import { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/SignUp.module.css';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3001/users/signup', formData);

            if (response.status === 200) {
                alert('Usuario creado con éxito');
                setFormData({
                    name: '',
                    username: '',
                    email: '',
                    password: '',
                });
            } else {
                alert('Error al crear el usuario');
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            setError(error.response?.data?.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`col`}>
            <div className={`p-3`}>
                <div className={`card ${styles.card_right}`}>
                    <h2>Create Account</h2>
                    <form onSubmit={handleSubmit}>
                        {error && <p className={styles.error}>{error}</p>}
                        <div className={`form-floating mb-3 mt-4`}>
                            <input
                                type="text"
                                className={`form-control`}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nombre"
                                required
                            />
                            <label htmlFor="name">Nombre</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className={`form-control`}
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Username"
                                required
                            />
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className={`form-control`}
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                            <label htmlFor="email">Email</label>
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
                            {loading ? 'Registrando...' : 'Sign Up'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
