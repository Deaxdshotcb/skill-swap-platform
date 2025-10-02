import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Avatar from '../components/Avatar';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [opportunities, setOpportunities] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recsRes, oppsRes] = await Promise.all([
                    api.get('/dashboard/recommendations'),
                    api.get('/dashboard/opportunities')
                ]);
                setRecommendations(recsRes.data);
                setOpportunities(oppsRes.data);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={styles.dashboard}>
            <div className={styles.section}>
                <h2>Recommended Users For You</h2>
                <p>These users offer skills you're looking for.</p>
                <div className={styles.cardGrid}>
                    {recommendations.length > 0 ? recommendations.map(user => (
                        // The key can now just be the user.id since it's guaranteed to be unique
                        <Link to={`/profile/${user.id}`} key={`rec-${user.id}`} className={styles.userCard}>
                            <Avatar username={user.username} size={60} />
                            <h4>{user.username}</h4>
                            {/* Display the new comma-separated list of skills */}
                            <p>Teaches: <strong>{user.skills_offered}</strong></p>
                        </Link>
                    )) : <p>No recommendations yet. Add some skill requests on your profile!</p>}
                </div>
            </div>

            <div className={styles.section}>
                <h2>Opportunities to Teach</h2>
                <p>These users are looking for skills you have.</p>
                <div className={styles.list}>
                    {opportunities.length > 0 ? opportunities.map(opp => (
                         // The key can now just be the requester_id
                         <Link to={`/profile/${opp.requester_id}`} key={`opp-${opp.requester_id}`} className={styles.listItem}>
                            {/* Display the new comma-separated list of skills */}
                            <p><strong>{opp.requester_name}</strong> is looking for a <strong>{opp.skills_requested}</strong> teacher.</p>
                        </Link>
                    )) : <p>No opportunities found right now. Make sure you have skills listed on your profile!</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;