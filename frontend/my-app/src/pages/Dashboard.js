import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [opportunities, setOpportunities] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all dashboard data in parallel
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
            {/* Section 1: Recommended Users */}
            <div className={styles.section}>
                <h2>Recommended Users For You</h2>
                <p>These users offer skills you're looking for.</p>
                <div className={styles.cardGrid}>
                    {recommendations.length > 0 ? recommendations.map(user => (
                        <Link to={`/profile/${user.id}`} key={`rec-${user.id}`} className={styles.userCard}>
                            <div className={styles.avatar}></div>
                            <h4>{user.username}</h4>
                            <p>Teaches: <strong>{user.skill_name}</strong></p>
                        </Link>
                    )) : <p>No recommendations yet. Add some skill requests on your profile!</p>}
                </div>
            </div>

            {/* Section 2: Opportunities */}
            <div className={styles.section}>
                <h2>Opportunities to Teach</h2>
                <p>These users are looking for skills you have.</p>
                <div className={styles.list}>
                    {opportunities.length > 0 ? opportunities.map(opp => (
                         <Link to={`/profile/${opp.requester_id}`} key={`opp-${opp.requester_id}`} className={styles.listItem}>
                            <p><strong>{opp.requester_name}</strong> is looking for a <strong>{opp.skill_name}</strong> teacher.</p>
                        </Link>
                    )) : <p>No opportunities found right now. Make sure you have skills listed on your profile!</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;