import { jwtDecode } from 'jwt-decode';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../api';
import styles from './Chat.module.css';

const socket = io('http://localhost:5000'); 

const Chat = () => {
    const { matchId } = useParams();
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const chatEndRef = useRef(null);

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const currentUserId = decodedToken.user.id;

    useEffect(() => {
        // Join the chat room for this specific match
        socket.emit('join_chat', matchId);

        // Fetch previous messages
        const fetchMessages = async () => {
            try {
                const res = await api.get(`/matches/${matchId}/messages`);
                setChatHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };
        fetchMessages();

        // Listen for new incoming messages
        socket.on('receive_message', (data) => {
            setChatHistory(prev => [...prev, data]);
        });

        // Clean up the listener when the component unmounts
        return () => socket.off('receive_message');
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
            socket.emit('send_message', messageData);
            setChatHistory(prev => [...prev, { ...messageData, sender_username: 'You' }]);
            setMessage('');
        }
    };
    
    return (
        <div className={styles.chatContainer}>
            {/* ... (rest of the JSX is unchanged) ... */}
        </div>
    );
};

export default Chat;