import styles from './ChatBubble.module.css';

const ChatBubble = ({ message, isSender }) => {
  return (
    <div className={`${styles.bubbleContainer} ${isSender ? styles.sender : styles.receiver}`}>
      <p className={styles.bubble}>{message}</p>
    </div>
  );
};

export default ChatBubble;