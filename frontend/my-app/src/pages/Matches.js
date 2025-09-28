import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProfileMatchCard from '../components/ProfileMatchCard';
import styles from './Matches.module.css';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const fetchExistingMatches = async () => {
        try {
            const res = await api.get('/matches');
            setMatches(res.data);
        } catch (err) {
            console.error("Failed to fetch matches", err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setCurrentUserId(decoded.user.id);
        }
        fetchExistingMatches();
    }, []);

    const findMatches = async () => {
        setIsLoading(true);
        try {
            const res = await api.post('/matches/find');
            alert(res.data.msg);
            // Refresh the list after finding new matches
            fetchExistingMatches(); 
        } catch (err) {
            alert('Could not search for new matches.');
            console.error(err);
        }
        setIsLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Your Matches</h2>
                <button onClick={findMatches} disabled={isLoading} className={styles.findButton}>
                    {isLoading ? 'Searching...' : 'Find New Matches'}
                </button>
            </div>
            
            <div className={styles.matchesGrid}>
                {matches.length > 0 ? (
                    matches.map(match => {
                        const otherUser = match.user1_id === currentUserId
                            ? { id: match.user2_id, name: match.user2_username }
                            : { id: match.user1_id, name: match.user1_username };

                        return (
                            <Link to={`/chat/${match.match_id}`} key={match.match_id} className={styles.cardLink}>
                                <ProfileMatchCard 
                                    name={otherUser.name}
                                    skills="Click to Chat"
                                    matchPercent={90}
                                />
                            </Link>
                        );
                    })
                ) : (
                    <p>No matches found yet. Create more offers and requests, then click "Find New Matches"!</p>
                )}
            </div>
        </div>
    );
};

export default Matches;