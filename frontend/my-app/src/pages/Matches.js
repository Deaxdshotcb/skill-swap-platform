import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Avatar from '../components/Avatar';
import styles from './Matches.module.css';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    const fetchExistingMatches = async () => {
        try {
            const res = await api.get('/matches');
            setMatches(res.data);
        } catch (err) { console.error("Failed to fetch matches", err); }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUserId(decoded.user.id);
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
        fetchExistingMatches();
    }, [navigate]);

    const findMatches = async () => {
        setIsLoading(true);
        try {
            const res = await api.post('/matches/find');
            alert(res.data.msg);
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
                            // --- MODIFICATION HERE ---
                            // We now pass the other user's name in the 'state' prop
                            <Link to={`/chat/${match.match_id}`} state={{ otherUserName: otherUser.name }} key={match.match_id} className={styles.cardLink}>
                                <div className={styles.matchCard}>
                                    <Avatar username={otherUser.name} size={50} />
                                    <h4>{otherUser.name}</h4>
                                    <p>Click to Chat</p>
                                </div>
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