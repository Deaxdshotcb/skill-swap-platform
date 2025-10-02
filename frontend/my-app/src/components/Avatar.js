import styles from './Avatar.module.css';

const generateColor = (name = '') => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa'];
    const index = Math.abs(hash % colors.length);
    return colors[index];
};

const Avatar = ({ username, size }) => {
    const letter = username ? username.charAt(0).toUpperCase() : '?';
    const color = generateColor(username);

    const style = {
        width: size ? `${size}px` : '40px',
        height: size ? `${size}px` : '40px',
        fontSize: size ? `${size / 2}px` : '1rem',
        backgroundColor: color
    };

    return (
        <div className={styles.avatar} style={style}>
            {letter}
        </div>
    );
};

export default Avatar;