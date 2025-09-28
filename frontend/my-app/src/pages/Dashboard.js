import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileMatchCard from '../components/ProfileMatchCard';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const dummyMatches = [
            { id: 1, name: 'Alice', skills: 'Painting', matchPercent: 90 },
            { id: 2, name: 'Charlie', skills: 'Gardening', matchPercent: 85 },
            { id: 3, name: 'David', skills: 'Web Design', matchPercent: 88 },
        ];
        setMatches(dummyMatches);
    }, []);

    return (
        <div className={styles.dashboard}>
            <div className={styles.actions}>
                <button className={`${styles.actionButton} ${styles.addSkill}`} onClick={() => navigate('/create')}>+ Add Skills</button>
                <button className={`${styles.actionButton} ${styles.addBio}`} onClick={() => navigate('/profile/me')}>+ Add Bio</button>
                <button className={`${styles.actionButton} ${styles.offerSkill}`} onClick={() => navigate('/create')}>+ Offer Skills</button>
                <button className={`${styles.actionButton} ${styles.requestSkill}`} onClick={() => navigate('/create')}>+ Request Skills</button>
            </div>

            <div className={styles.matchesContainer}>
                <h2>Profile Matches</h2>
                <div className={styles.matchesGrid}>
                    {matches.map(match => (
                        <ProfileMatchCard 
                            key={match.id}
                            name={match.name}
                            skills={match.skills}
                            matchPercent={match.matchPercent}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;