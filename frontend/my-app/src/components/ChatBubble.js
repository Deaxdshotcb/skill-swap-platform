import styles from './ChatBubble.module.css';

const ChatBubble = ({ message, isSender }) => {
    return (
        <div className={`${styles.bubbleContainer} ${isSender ? styles.sender : styles.receiver}`}>
            <div className={styles.bubble}>
                {message}
            </div>
        </div>
    );
};

export default ChatBubble;