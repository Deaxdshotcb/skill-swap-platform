import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import api from '../api';
import styles from './Login.module.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        /*
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            alert('Error logging in');
            console.error(err);
        }*/
        console.log("Simulating a successful login...");
        localStorage.setItem('token', 'fake-jwt-token-for-testing');
        navigate('/dashboard');
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <div className={styles.marketingBox}>
                    <h1>Skill Swap</h1>
                    <p>This is Our Marketing Message. Exchange skills and grow together.</p>
                </div>
            </div>
            <div className={styles.rightPanel}>
                <div className={styles.formContainer}>
                    <div className={styles.toggle}>
                        <Link to="/register" className={styles.toggleLink}>Sign Up</Link>
                        <Link to="/login" className={`${styles.toggleLink} ${styles.active}`}>Login</Link>
                    </div>
                    <h2>Login</h2>
                    <form onSubmit={onSubmit}>
                        <input type="email" name="email" placeholder="Email" onChange={onChange} required className={styles.input} />
                        <input type="password" name="password" placeholder="Password" onChange={onChange} required className={styles.input} />
                        <button type="submit" className={styles.button}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;