import style from '../../styles/Header.module.css';
import logo from '../../assets/logoEditado.png';

const SignUp = () => {
    return (
        <nav className= {`navbar bg-body-tertiary ${style.container_navbar}`}>
            <div className={`container-fluid`}>
                <a className={`navbar-brand ${style.container_}`} href="#">
                    <img src= { logo } alt="Logo" width="150" height="50" className={`d-inline-block align-text-top`} />
                </a>
                <form className={`d-flex`} role="search">
                    <input className={`form-control me-2 ${style.input_search}`} type="search" placeholder="Busca cualquier producto" aria-label="Search" />
                    <button className={`btn btn-outline-success ${style.boton_search}`} type="submit">
                        <i className={`bi bi-search`}> </i>
                    </button>
                </form>
                <button type="submit" className={`btn btn-outline-success ${style.boton_login}`}>Regístrate/Inicia Sesión</button>
                <button type="submit" className={`btn btn-outline-success ${style.boton_vender}`}>
                    <i className={`bi bi-plus-circle`}> </i>Vende
                </button>
            </div>
        </nav>
    );
};

export default SignUp;