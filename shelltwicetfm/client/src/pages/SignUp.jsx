import { useNavigate } from 'react-router-dom';
import styles from '../styles/SignUp.module.css';
import logo from '../assets/logoEditado.png';
import SignUpForm from '../components/Forms/SignUpForm';

const SignUp = () => {

    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className = {`container-fluid px-4 text-center ${styles.container}`}>
            <div className={`row gx-5`}>
                <div className={`col`}>
                    <div className= {`p-3`}>
                        <div className= {`card ${styles.card_right}`}>
                            <img src={logo} className={`card-img-top ${styles.logo}`} alt="Logo ShellTwice" />
                            <div className={`card-body`}>
                                <p className={`card-text`}>¿Ya tienes cuenta? Haz <strong>Login</strong></p>
                                <button onClick={handleLoginRedirect} className= {`btn btn-primary mt-3 ${styles.boton_signup}`}>Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            <SignUpForm/>
            </div>
        </div>
    );
};

export default SignUp;
