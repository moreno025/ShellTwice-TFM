import styles from '../styles/SignUp.module.css';
import logo from '../assets/logoEditado.png';

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
                <div className={`col`}>
                    <div className={`p-3`}>
                        <div className= {`card ${styles.card_right}`}>
                        <h2>Create Account</h2>
                            <div className={`form-floating mb-3 mt-4`}>
                                <input type="text" className={`form-control`} placeholder="Nombre" />
                                <label>Nombre</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className={`form-control`} placeholder="Username" />
                                <label>Username</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className={`form-control`} placeholder="Email" />
                                <label>Email</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className={`form-control`} placeholder="Password" />
                                <label>Password</label>
                            </div>
                            <button type="button" className={`btn btn-primary mt-3 ${styles.boton_signup}`}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
