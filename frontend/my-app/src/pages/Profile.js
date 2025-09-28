import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Profile.module.css';

const Profile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null); // In a real app, fetch user data
    
    // Placeholder data
    useEffect(() => {
        setUser({
            name: 'User Name',
            level: 100,
            bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            skills: ['JavaScript', 'React', 'Node.js', 'Guitar', 'Cooking']
        });
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.profileContainer}>
            <h2>Profile</h2>
            <div className={styles.profileCard}>
                <div className={styles.avatar}></div>
                <div className={styles.profileInfo}>
                    <h3>{user.name}</h3>
                    <p className={styles.level}>Level {user.level}</p>
                    <p className={styles.bio}>{user.bio}</p>
                    <div className={styles.skills}>
                        <strong>Skills:</strong>
                        <span>{user.skills.join(', ')}</span>
                    </div>
                </div>
            </div>

            <div className={styles.reportSection}>
                <h3>Report User</h3>
                <textarea className={styles.reportInput} placeholder="Reason..."></textarea>
                <button className={styles.reportButton}>Block User</button>
            </div>
        </div>
    );
};

export default Profile;