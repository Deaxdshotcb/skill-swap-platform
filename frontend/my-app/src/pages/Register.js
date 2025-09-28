import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import styles from './Login.module.css'; // Re-use Login styles for consistency

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            alert('Error registering');
            console.error(err);
        }
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
                        <Link to="/register" className={`${styles.toggleLink} ${styles.active}`}>Sign Up</Link>
                        <Link to="/login" className={styles.toggleLink}>Login</Link>
                    </div>
                    <h2>Create an Account</h2>
                    <form onSubmit={onSubmit}>
                        <input type="text" name="username" placeholder="Username" onChange={onChange} required className={styles.input} />
                        <input type="email" name="email" placeholder="Email" onChange={onChange} required className={styles.input} />
                        <input type="password" name="password" placeholder="Password" onChange={onChange} required className={styles.input} />
                        <button type="submit" className={styles.button}>Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;