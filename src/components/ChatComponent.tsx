'use client';

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

let socket: any;

type ChatMessage = {
  gigId: string;
  message: string;
  sender: string;
  recipient: string;
};

const ChatComponent = ({
  gigId,
  applicantId,
  posterId,
  recipient,
}: {
  gigId: string;
  applicantId: string;
  posterId: string;
  recipient: string;
}) => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem('userId') || 'defaultUser';
  const messagesEndRef = useRef<HTMLDivElement>(null); // Reference for the last message

  // Initialize socket and listen for new messages
  useEffect(() => {
    if (!gigId) {
      console.error('Invalid gigId');
      return;
    }

    socket = io("http://localhost:4000");

    socket.emit('join_gig', gigId);

    socket.on("receive_message", (newMessage: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [gigId]);

  const sendMessage = async () => {
    if (message.trim() !== '') {
      console.log('Sending message to:', recipient);

      const newMessage = {
        gigId,
        message,
        sender: userId,
        recipient,
      };

      // Emit message through socket
      socket.emit('send_message', newMessage);

      // Save the message to the database via the Next.js API route
      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessage),
        });

        if (response.ok) {
          setMessage(''); // Clear the message input
        } else {
          console.error('Failed to save message');
        }
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?gigId=${gigId}`);
      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages); // Update the state with the fetched messages
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [gigId]);

  // Scroll to the bottom when new messages are received
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // This effect runs when the messages state changes

  const toggleChat = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default "Enter" key action (which adds a newline)
      sendMessage(); // Trigger message send on Enter
    }
  };

  return (
    <>
      <button onClick={toggleChat} className="text-[#3B2ECC] hover:underline mt-3">
        Open Chat
      </button>

      {isOpen && (
        <div className="modal" ref={modalRef}>
          <div className="chat-box">
            <button
              onClick={toggleChat}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <span className="text-xl">✖</span>
            </button>

            <div className="messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender === userId ? 'sent' : 'received'}`}
                  style={{
                    textAlign: msg.sender === userId ? 'right' : 'left',
                    backgroundColor: msg.sender === userId ? '#4c7aff' : '#e3e3e3',
                    borderRadius: '15px',
                    padding: '10px',
                    margin: '5px 0',
                    maxWidth: '70%',
                    marginLeft: msg.sender === userId ? 'auto' : '0',
                  }}
                >
                  <p>{msg.message}</p>
                </div>
              ))}
              {/* Empty div for scrolling to bottom */}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown} // Add the event listener for "Enter" key
                placeholder="Type a message"
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatComponent;
