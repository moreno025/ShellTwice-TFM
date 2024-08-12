import { useNavigate } from 'react-router-dom';
import styles from '../styles/SignUp.module.css';
import logo from '../assets/logoEditado.png';
import LoginForm from '../components/Forms/LoginForm';

const Login = () => {
    const navigate = useNavigate();

    const handleSignUpRedirect = () => {
        navigate('/signup');
    };

    return (
        <div className={`container-fluid px-4 text-center ${styles.container}`}>
            <div className={`row gx-5`}>
                <LoginForm />
                <div className={`col`}>
                    <div className={`p-3`}>
                        <div className={`card ${styles.card_right}`}>
                            <img src={logo} className={`card-img-top ${styles.logo}`} alt="Logo ShellTwice" />
                            <div className={`card-body`}>
                                <p className={`card-text`}>
                                    ¿Todavía no tienes cuenta? <strong>Regístrate</strong>
                                </p>
                                <button onClick={handleSignUpRedirect} className={`btn btn-primary mt-3 ${styles.boton_signup}`}>
                                    Regístrate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
