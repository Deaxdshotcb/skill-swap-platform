import styles from './ProfileMatchCard.module.css';

const ProfileMatchCard = ({ name, skills, matchPercent }) => {
    return (
        <div className={styles.card}>
            <div className={styles.avatar}></div>
            <p className={styles.level}>LvL 1</p>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.skills}>Skills: {skills}</p>
            <p className={styles.match}>Match: {matchPercent}%</p>
            <button className={styles.requestButton}>Request</button>
        </div>
    );
};

export default ProfileMatchCard;