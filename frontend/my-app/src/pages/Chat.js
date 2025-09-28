import { jwtDecode } from 'jwt-decode';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../api';
import ChatBubble from '../components/ChatBubble'; // <-- Import the new component
import styles from './Chat.module.css';

const socket = io('http://localhost:5000'); 

const Chat = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUser(decoded.user);
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    }, [navigate]);

    useEffect(() => {
        if (!currentUser) return; // Don't run if user isn't set yet

        socket.emit('join_chat', matchId);

        const fetchMessages = async () => {
            try {
                const res = await api.get(`/matches/${matchId}/messages`);
                setChatHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };
        fetchMessages();

        socket.on('receive_message', (data) => {
            // Only add the message if it's not from the current user
            // to avoid duplicates from optimistic update
            if (data.sender_id !== currentUser.id) {
                setChatHistory(prev => [...prev, data]);
            }
        });

        return () => socket.off('receive_message');
    }, [matchId, currentUser]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && currentUser) {
            const messageData = {
                match_id: matchId,
                sender_id: currentUser.id,
                content: message,
            };
            socket.emit('send_message', messageData);
            
            // Optimistically add your own message to the chat right away
            setChatHistory(prev => [...prev, { ...messageData, sender_username: 'You' }]);
            setMessage('');
        }
    };
    
    // --- THIS IS THE MISSING JSX ---
    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <div className={styles.avatar}></div>
                <div className={styles.userInfo}>
                    <span className={styles.userName}>Chat Room</span>
                    <span className={styles.lastSeen}>Online</span>
                </div>
                <div className={styles.icons}>📞 📹 ☰</div>
            </div>

            <div className={styles.chatArea}>
                {chatHistory.map((msg, index) => (
                    <ChatBubble 
                        key={index} 
                        message={msg.content} 
                        isSender={msg.sender_id === currentUser?.id} 
                    />
                ))}
                <div ref={chatEndRef} />
            </div>

            <form className={styles.inputArea} onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;