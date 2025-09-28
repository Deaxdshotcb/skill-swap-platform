import { useEffect, useState } from 'react';
import api from '../api';
import styles from './CreateOfferRequest.module.css';

const CreateOfferRequest = () => {
    const [skills, setSkills] = useState([]);
    const [offerData, setOfferData] = useState({ skill_id: '', experience_level: 'Beginner' });
    const [requestData, setRequestData] = useState({ skill_id: '' });

    useEffect(() => {
        const fetchSkills = async () => {
            const res = await api.get('/skills');
            setSkills(res.data);
            if (res.data.length > 0) {
                setOfferData(prev => ({ ...prev, skill_id: res.data[0].skill_id }));
                setRequestData({ skill_id: res.data[0].skill_id });
            }
        };
        fetchSkills();
    }, []);
    
    const handleOfferSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/offers', offerData);
            alert('Offer created successfully!');
        } catch (err) {
            alert('Failed to create offer.');
        }
    };
    
    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/requests', requestData);
            alert('Request created successfully!');
        } catch (err) {
            alert('Failed to create request.');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Offer & Request Skills</h2>
            <div className={styles.formGrid}>
                <form onSubmit={handleOfferSubmit} className={styles.formCard}>
                    <h3>Offer a Skill</h3>
                    <label>Skill</label>
                    <select className={styles.select} value={offerData.skill_id} onChange={e => setOfferData({...offerData, skill_id: e.target.value})}>
                        {skills.map(skill => <option key={skill.skill_id} value={skill.skill_id}>{skill.skill_name}</option>)}
                    </select>
                    <label>Experience Level</label>
                    <select className={styles.select} value={offerData.experience_level} onChange={e => setOfferData({...offerData, experience_level: e.target.value})}>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Expert</option>
                    </select>
                    <button type="submit" className={styles.button}>Create Offer</button>
                </form>

                <form onSubmit={handleRequestSubmit} className={styles.formCard}>
                    <h3>Request a Skill</h3>
                    <label>Skill</label>
                    <select className={styles.select} value={requestData.skill_id} onChange={e => setRequestData({skill_id: e.target.value})}>
                        {skills.map(skill => <option key={skill.skill_id} value={skill.skill_id}>{skill.skill_name}</option>)}
                    </select>
                    <button type="submit" className={styles.button}>Create Request</button>
                </form>
            </div>
        </div>
    );
};

export default CreateOfferRequest;