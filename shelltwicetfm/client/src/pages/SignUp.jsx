import styles from '../styles/SignUp.module.css';
import logo from '../assets/logoEditado.png';
import SignUpForm from '../components/Forms/SignUpForm';

const SignUp = () => {
    return (
        <div className = {`container-fluid px-4 text-center ${styles.container}`}>
            <div className={`row gx-5`}>
                <div className={`col`}>
                    <div className= {`p-3`}>
                        <div className= {`card ${styles.card_left}`}>
                            <img src={logo} className={`card-img-top ${styles.logo}`} alt="Logo ShellTwice" />
                            <div className={`card-body`}>
                                <p className={`card-text`}>¿Ya tienes cuenta? Haz <strong><a href=''>Login</a></strong></p>
                                <a href="#" className= {`btn btn-primary mt-3 ${styles.boton_signup}`}>Login</a>
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
