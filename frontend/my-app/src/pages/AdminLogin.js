import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import styles from './Login.module.css'; // Reuses the same great styles

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/admin/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            alert('Admin login failed. Please check your credentials.');
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <div className={styles.marketingBox}>
                    <h1>Skill Swap</h1>
                    <p>Administrator Portal</p>
                </div>
            </div>
            <div className={styles.rightPanel}>
                <div className={styles.formContainer}>
                    <h2>Admin Login</h2>
                    <form onSubmit={onSubmit}>
                        <input type="email" name="email" placeholder="Admin Email" onChange={onChange} required className={styles.input} />
                        <input type="password" name="password" placeholder="Password" onChange={onChange} required className={styles.input} />
                        <button type="submit" className={styles.button}>Login as Admin</button>
                    </form>

                    {/* --- NEW LINK TO GO BACK TO USER LOGIN --- */}
                    <div className={styles.adminLink}>
                        <Link to="/login">Not an admin? Go to user login.</Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminLogin;