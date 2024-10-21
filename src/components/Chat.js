import React, { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore'; 
import { db } from '../firebase/firebase-config';

const Chat = ({ currentUserId, chatPartnerId }) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        const messagesRef = collection(db, 'messages');
        const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
            const fetchedMessages = snapshot.docs
                .filter(doc => 
                    (doc.data().senderId === currentUserId && doc.data().receiverId === chatPartnerId) ||
                    (doc.data().senderId === chatPartnerId && doc.data().receiverId === currentUserId)
                )
                .map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, [currentUserId, chatPartnerId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (messageInput.trim()) {
            await addDoc(collection(db, 'messages'), {
                senderId: currentUserId,
                receiverId: chatPartnerId,
                text: messageInput,
                timestamp: new Date(),
            });
            setMessageInput('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto p-4">
                {messages.map((message) => (
                    <div key={message.id} className={`mb-2 ${message.senderId === currentUserId ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-2 rounded-lg ${message.senderId === currentUserId ? 'bg-blue-400 text-white' : 'bg-gray-300 text-black'}`}>
                            {message.text}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex p-4 border-t">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 border p-2 rounded-l-lg"
                    placeholder="Type your message..."
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">Send</button>
            </form>
        </div>
    );
};

export default Chat;
