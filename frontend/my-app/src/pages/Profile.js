import { jwtDecode } from 'jwt-decode';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import Avatar from '../components/Avatar';
import styles from './Profile.module.css';

const Profile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [matchInfo, setMatchInfo] = useState({ isMatch: false, match_id: null });
    const [skills, setSkills] = useState([]);
    const [offerData, setOfferData] = useState({ skill_id: '', experience_level: 'Beginner' });
    const [requestData, setRequestData] = useState({ skill_id: '' });
    const [reportReason, setReportReason] = useState('');

    // State for offering a new skill
    const [isAddingNewSkill, setIsAddingNewSkill] = useState(false);
    const [newSkillName, setNewSkillName] = useState('');
    
    // State for requesting a new skill
    const [isAddingNewRequestSkill, setIsAddingNewRequestSkill] = useState(false);
    const [newRequestSkillName, setNewRequestSkillName] = useState('');

    const loadProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }
            const decoded = jwtDecode(token);
            const loggedInUserId = decoded.user?.id;
            if (!loggedInUserId) { navigate('/login'); return; }
            const viewingOwnProfile = userId === 'me' || loggedInUserId.toString() === userId.toString();
            setIsOwnProfile(viewingOwnProfile);
            const profileIdToFetch = viewingOwnProfile ? loggedInUserId : userId;
            const endpoint = viewingOwnProfile ? '/users/me' : `/users/${profileIdToFetch}`;
            const profileRes = await api.get(endpoint);
            setProfileData(profileRes.data);
            if (viewingOwnProfile) {
                const skillsRes = await api.get('/skills');
                setSkills(skillsRes.data);
            } else {
                const matchStatusRes = await api.get(`/matches/status/${profileIdToFetch}`);
                setMatchInfo(matchStatusRes.data);
            }
        } catch (err) {
            console.error("Failed to load profile data", err);
        }
    }, [userId, navigate]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        await api.put('/users/me', { username: profileData.username, bio: profileData.bio });
        alert('Profile updated!');
        setIsEditing(false);
    };

    const handleOfferSubmit = async (e) => {
        e.preventDefault();
        try {
            let skillToOfferId;
            if (isAddingNewSkill) {
                if (!newSkillName.trim()) return alert('Please enter the name for the new skill.');
                const newSkillRes = await api.post('/skills', { name: newSkillName });
                skillToOfferId = newSkillRes.data.id;
            } else {
                if (!offerData.skill_id) return alert('Please select a skill to offer.');
                skillToOfferId = offerData.skill_id;
            }
            await api.post('/offers', {
                skill_id: skillToOfferId,
                experience_level: offerData.experience_level
            });
            alert('Offer created successfully!');
            setNewSkillName('');
            setIsAddingNewSkill(false);
            setOfferData({ skill_id: '', experience_level: 'Beginner' });
            loadProfile();
        } catch (err) {
            console.error("Failed to create offer", err);
            alert('Failed to create offer. The skill may already exist.');
        }
    };

    const handleRemoveSkill = async (offerId) => {
        if (window.confirm('Are you sure you want to remove this skill offer?')) {
            try {
                await api.delete(`/offers/${offerId}`);
                alert('Skill offer removed!');
                loadProfile();
            } catch (err) {
                console.error('Failed to remove skill offer', err);
                alert('Could not remove the skill offer. Please try again.');
            }
        }
    };
    
    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            let skillToRequestId;
            if (isAddingNewRequestSkill) {
                if (!newRequestSkillName.trim()) return alert('Please enter a name for the new skill.');
                const newSkillRes = await api.post('/skills', { name: newRequestSkillName });
                skillToRequestId = newSkillRes.data.id;
            } else {
                if (!requestData.skill_id) return alert('Please select a skill to request.');
                skillToRequestId = requestData.skill_id;
            }
            await api.post('/requests', { skill_id: skillToRequestId });
            alert('Request created successfully!');
            setNewRequestSkillName('');
            setIsAddingNewRequestSkill(false);
            setRequestData({ skill_id: '' });
            loadProfile();
        } catch (err) {
            console.error("Failed to create request", err);
            alert('Failed to create request. The skill may already exist.');
        }
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        await api.post('/reports', { reported_id: userId, reason: reportReason });
        alert('Report submitted successfully.');
        setReportReason('');
    };

    const handleCreateMatch = async (skillIdToRequest) => {
        if (!window.confirm("This will add this skill to your requests and attempt to find matches. Proceed?")) return;
        try {
            await api.post('/requests', { skill_id: skillIdToRequest });
            const matchRes = await api.post('/matches/find');
            alert(matchRes.data.msg);
            navigate('/matches');
        } catch (err) {
            alert('Failed to create match. You may already have this request or match.');
        }
    };

    if (!profileData) return <div>Loading Profile...</div>;

    const uniqueSkillsOffered = profileData.skills_offered ? [...new Map(profileData.skills_offered.map(item => [item.id, item])).values()] : [];

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <Avatar username={profileData.username} size={100} />
                {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className={styles.editForm}>
                        <label>Username</label>
                        <input type="text" value={profileData.username} onChange={e => setProfileData({...profileData, username: e.target.value})} />
                        <label>Bio</label>
                        <textarea value={profileData.bio || ''} onChange={e => setProfileData({...profileData, bio: e.target.value})} />
                        <div className={styles.editActions}>
                            <button type="submit" className={styles.saveButton}>Save Changes</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <div className={styles.profileInfo}>
                        <h3>{profileData.username}</h3>
                        <p className={styles.bio}>{profileData.bio || 'No bio yet.'}</p>
                        {!isOwnProfile && (
                            <div className={styles.skills}>
                                <strong>Skills Offered:</strong>
                                <span>{profileData.skills_offered?.map(s => s.name).join(', ') || 'None yet'}</span>
                            </div>
                        )}
                        {isOwnProfile && <button onClick={() => setIsEditing(true)} className={styles.editButton}>Edit Profile</button>}
                        {!isOwnProfile && matchInfo.isMatch && (
                            <Link to={`/chat/${matchInfo.match_id}`} state={{ otherUserName: profileData.username }} className={styles.chatButton}>
                                Chat with {profileData.username}
                            </Link>
                        )}
                    </div>
                )}
            </div>
            
            {isOwnProfile && (
                <div className={styles.skillsSection}>
                    <h3>Your Offered Skills</h3>
                    {profileData.skills_offered && profileData.skills_offered.length > 0 ? (
                        <ul className={styles.skillsList}>
                            {profileData.skills_offered.map(skill => (
                                <li key={skill.offer_id} className={styles.skillItem}>
                                    <span>{skill.name} ({skill.experience_level})</span>
                                    <button onClick={() => handleRemoveSkill(skill.offer_id)} className={styles.removeButton}>
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You haven't offered any skills yet. Add one below!</p>
                    )}
                </div>
            )}

            {!isOwnProfile && !matchInfo.isMatch && (
                <div className={styles.skillsSection}>
                    <h3>Create a Match with {profileData.username}</h3>
                    <p>To create a match, request one of the skills they offer below.</p>
                    {uniqueSkillsOffered.length > 0 ? (
                        <ul className={styles.skillsList}>
                            {uniqueSkillsOffered.map(skill => ( 
                                <li key={skill.id} className={styles.skillItem}>
                                    <span>{skill.name} ({skill.experience_level})</span>
                                    <button onClick={() => handleCreateMatch(skill.id)}>
                                        Request & Match
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : ( <p>{profileData.username} has not offered any skills yet.</p> )}
                </div>
            )}
            
            {isOwnProfile && (
                <div className={styles.formGrid}>
                    <form onSubmit={handleOfferSubmit} className={styles.formCard}>
                        <h4>Offer a New Skill</h4>
                        <div className={styles.toggleContainer}>
                            <input type="checkbox" id="addNewSkill" checked={isAddingNewSkill} onChange={e => setIsAddingNewSkill(e.target.checked)}/>
                            <label htmlFor="addNewSkill">Add a new skill not on the list</label>
                        </div>
                        {isAddingNewSkill ? (
                            <input type="text" placeholder="Enter new skill name" value={newSkillName} onChange={e => setNewSkillName(e.target.value)} className={styles.formInput} required/>
                        ) : (
                            <select onChange={e => setOfferData({...offerData, skill_id: e.target.value})} value={offerData.skill_id} className={styles.formInput} required>
                                <option value="">-- Select Skill --</option>
                                {skills.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
                            </select>
                        )}
                        <select onChange={e => setOfferData({...offerData, experience_level: e.target.value})} value={offerData.experience_level} className={styles.formInput}>
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                            <option>Expert</option>
                        </select>
                        <button type="submit">Create Offer</button>
                    </form>
                    
                    <form onSubmit={handleRequestSubmit} className={styles.formCard}>
                        <h4>Request a Skill</h4>
                        <div className={styles.toggleContainer}>
                            <input
                                type="checkbox"
                                id="addNewRequestSkill"
                                checked={isAddingNewRequestSkill}
                                onChange={e => setIsAddingNewRequestSkill(e.target.checked)}
                            />
                            <label htmlFor="addNewRequestSkill">Add a new skill not on the list</label>
                        </div>
                        {isAddingNewRequestSkill ? (
                            <input
                                type="text"
                                placeholder="Enter skill name to request"
                                value={newRequestSkillName}
                                onChange={e => setNewRequestSkillName(e.target.value)}
                                className={styles.formInput}
                                required
                            />
                        ) : (
                            <select
                                onChange={e => setRequestData({ skill_id: e.target.value })}
                                value={requestData.skill_id}
                                className={styles.formInput}
                                required
                            >
                                <option value="">-- Select Skill --</option>
                                {skills.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
                            </select>
                        )}
                        <button type="submit">Create Request</button>
                    </form>
                </div>
            )}

            {!isOwnProfile && (
                <div className={styles.reportSection}>
                    <h3>Report User</h3>
                    <form onSubmit={handleReportSubmit}>
                        <textarea className={styles.reportInput} placeholder="Reason for reporting..." value={reportReason} onChange={e => setReportReason(e.target.value)} required></textarea>
                        <button type="submit" className={styles.reportButton}>Submit Report</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Profile;