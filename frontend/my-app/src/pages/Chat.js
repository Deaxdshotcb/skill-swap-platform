import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
// The next two lines are commented out as they require the backend
// import io from 'socket.io-client'; 
// import { jwtDecode } from 'jwt-decode'; 
import ChatBubble from '../components/ChatBubble';
import styles from './Chat.module.css';

// We also comment out the initial socket connection
// const socket = io('http://localhost:5000'); 

const Chat = () => {
    const { matchId } = useParams();
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { sender_id: 2, content: "Hey! This is a test message." },
        { sender_id: 1, content: "This is my reply in test mode." },
        { sender_id: 2, content: "The UI is working!" },
    ]);
    const chatEndRef = useRef(null);

    // --- THIS IS THE MODIFIED PART ---
    // The JWT decoding is commented out. We use a fake ID.
    /*
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const currentUserId = decodedToken.user.id;
    */
    const currentUserId = 1; // Your fake user ID is 1 for testing

    useEffect(() => {
        // All socket connection logic is commented out.
        /*
        socket.emit('join_room', matchId);
        socket.on('receive_message', (data) => {
            setChatHistory(prev => [...prev, data]);
        });
        return () => socket.off('receive_message');
        */
    }, [matchId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const messageData = {
                match_id: matchId,
                sender_id: currentUserId,
                content: message,
            };
            // The socket.emit call is commented out.
            // socket.emit('send_message', messageData);
            
            // This line still works, so you can see your own messages appear.
            setChatHistory(prev => [...prev, messageData]);
            setMessage('');
        }
    };
    
    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <div className={styles.avatar}></div>
                <div className={styles.userInfo}>
                    <span className={styles.userName}>Test User</span>
                    <span className={styles.lastSeen}>Online</span>
                </div>
                <div className={styles.icons}>📞 📹 ☰</div>
            </div>

            <div className={styles.chatArea}>
                {chatHistory.map((msg, index) => (
                    <ChatBubble 
                        key={index} 
                        message={msg.content} 
                        isSender={msg.sender_id === currentUserId} 
                    />
                ))}
                <div ref={chatEndRef} />
            </div>

            <form className={styles.inputArea} onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type Here"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;