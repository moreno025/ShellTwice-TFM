import React from 'react';
import styles from '../styles/SignUp.module.css';
import logo from '../assets/logoShellTwice.png';

const SignUp = () => {
    return(
        <div className = { styles.sign_up_container }>
            <div className = { styles.left_panel }>
                <img src={ logo } alt="ShellTwice Logo" className="logo" />
                <h2>SHELLTWICE</h2>
                <p>EST. 2024</p>
                <p>¿Ya tienes una cuenta? <a href="/login">Login</a></p>
                <button className = { styles.sign_in_button }>Sign In</button>
            </div>
            <div className = { styles.right_panel }>
                <h2>Create Account</h2>
                <form>
                    <input type = 'text' placeholder='Name' required />
                    <input type = 'password' placeholder='Username' required />
                    <input type = 'email' placeholder='Email' required />
                    <input type = 'text' placeholder='Password' required />
                    <button type='submit'>Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;