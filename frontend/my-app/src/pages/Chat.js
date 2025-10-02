import { jwtDecode } from 'jwt-decode';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; // <-- Import useLocation
import io from 'socket.io-client';
import api from '../api';
import Avatar from '../components/Avatar'; // <-- Import Avatar
import ChatBubble from '../components/ChatBubble';
import styles from './Chat.module.css';

const socket = io('http://localhost:5000'); 

const Chat = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const location = useLocation(); // <-- Get the location object
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const chatEndRef = useRef(null);

    // Get the other user's name from the state passed by the Link in Matches.js
    const otherUserName = location.state?.otherUserName || 'Chat';

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
        if (!currentUser) return;

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
            
            const optimisticMessage = {
                ...messageData,
                sender_username: 'You',
                created_at: new Date().toISOString()
            };
            setChatHistory(prev => [...prev, optimisticMessage]);
            setMessage('');
        }
    };
    
    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                {/* --- MODIFICATIONS HERE --- */}
                <Avatar username={otherUserName} />
                <div className={styles.userInfo}>
                    <span className={styles.userName}>{otherUserName}</span>
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