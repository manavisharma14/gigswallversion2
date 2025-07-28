'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

type ChatMessage = {
  gigId: string;
  roomId: string;
  message: string;
  sender: string;
  recipient: string;
  createdAt?: string;
};

const ChatComponent = ({
  gigId,
  applicantId,
  posterId,
  recipient,
  setOpenChatForGig,
}: {
  gigId: string;
  applicantId: string;
  posterId: string;
  recipient: string;
  setOpenChatForGig: (value: string | null) => void;
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState('defaultUser');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const roomId = useMemo(() => `${gigId}_${posterId}_${applicantId}`, [
    gigId,
    posterId,
    applicantId,
  ]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) setUserId(storedUserId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!gigId || !recipient || !userId || !roomId) return;

    // Initialize socket only once
    if (!socketRef.current) {
      socketRef.current = io('https://gigswallversion2.onrender.com', {
        transports: ['websocket'],
        reconnection: true,
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        socketRef.current?.emit('join_room', roomId);
      });

      socketRef.current.on('reconnect', () => {
        socketRef.current?.emit('join_room', roomId);
      });

      socketRef.current.on('disconnect', () => setIsConnected(false));
      socketRef.current.on('connect_error', (err) =>
        console.error('Socket error:', err.message)
      );
    } else {
      socketRef.current.emit('join_room', roomId);
    }

    const handleReceiveMessage = (newMessage: ChatMessage) => {
      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            m.message === newMessage.message &&
            m.sender === newMessage.sender &&
            m.createdAt === newMessage.createdAt
        );
        return exists ? prev : [...prev, newMessage];
      });
    };

    socketRef.current.on('receive_message', handleReceiveMessage);

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?roomId=${roomId}`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMessages();

    return () => {
      socketRef.current?.off('receive_message', handleReceiveMessage);
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [gigId, recipient, userId, roomId, setOpenChatForGig]);

  const sendMessage = () => {
    if (!message.trim() || !socketRef.current?.connected) return;

    const newMessage: ChatMessage = {
      gigId,
      roomId,
      message,
      sender: userId,
      recipient,
      createdAt: new Date().toISOString(),
    };

    socketRef.current.emit('send_message', newMessage);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCloseChat = () => {
    setOpenChatForGig(null);
  };

  return (
    <div className="fixed bottom-5 right-5 bg-white border shadow-lg rounded-xl w-80 z-50">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <p className="font-semibold text-[#3B2ECC]">Chat</p>
        <button
          onClick={handleCloseChat}
          className="text-gray-500 hover:text-red-600 text-xl"
        >
          ✖
        </button>
      </div>

      <div className="h-64 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, idx) => {
          const formattedTime = msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Sending...';

          return (
            <div key={idx} className="flex flex-col">
              <div
                className={`text-sm px-3 py-2 rounded-lg max-w-[75%] ${
                  msg.sender === userId
                    ? 'bg-[#4B55C3] text-white ml-auto'
                    : 'bg-gray-200 text-black mr-auto'
                }`}
              >
                {msg.message}
              </div>
              <span
                className={`text-[10px] text-gray-500 mt-0.5 ${
                  msg.sender === userId ? 'text-right pr-1' : 'text-left pl-1'
                }`}
              >
                {formattedTime}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center border-t px-2 py-2">
        <input
          type="text"
          className="flex-1 text-sm px-3 py-2 border rounded-lg focus:outline-none"
          placeholder={isConnected ? 'Type a message' : 'Connecting...'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          className={`ml-2 px-3 py-2 rounded-lg text-sm ${
            isConnected
              ? 'bg-[#3B2ECC] text-white'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
          disabled={!isConnected}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;