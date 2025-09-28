import { useEffect, useState } from 'react';
// import api from '../api'; // Not needed for testing
import { Link } from 'react-router-dom';
import ProfileMatchCard from '../components/ProfileMatchCard';
import styles from './Matches.module.css';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const findMatches = async () => {
        // This function is disabled in test mode
        console.log("Finding new matches is disabled in frontend-only mode.");
        alert("This feature requires a backend connection.");
    };

    useEffect(() => {
        const fetchExistingMatches = () => {
            // --- THIS IS THE MODIFIED PART ---
            // The real API call is commented out.
            /*
            const res = await api.get('/matches');
            setMatches(res.data);
            */

            // We provide a hardcoded list of dummy matches for the UI.
            const dummyMatches = [
                { match_id: 1, other_username: 'Alice', other_user_id: 2 },
                { match_id: 2, other_username: 'Bob', other_user_id: 3 },
                { match_id: 3, other_username: 'Charlie', other_user_id: 4 },
            ];
            setMatches(dummyMatches);
        };
        fetchExistingMatches();
    }, []);

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
                    matches.map(match => (
                        <Link to={`/chat/${match.match_id}`} key={match.match_id} className={styles.cardLink}>
                            <ProfileMatchCard 
                                name={match.other_username}
                                skills="View Profile"
                                matchPercent={90}
                            />
                        </Link>
                    ))
                ) : (
                    <p>No matches found yet. Create more offers and requests!</p>
                )}
            </div>
        </div>
    );
};

export default Matches;