"use client";

import { useEffect, useRef, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendMessageToFirestore, createChatIfNotExists } from "@/lib/firebaseChat";

interface ChatMessage {
  message: string;
  sender: string;
  recipient: string;
  timestamp?: Timestamp;
}

const restrictedPatterns = [
  /\b\d{10}\b/,                                // plain 10-digit phone numbers
  /\b\d{3}[-.\s]??\d{3}[-.\s]??\d{4}\b/,       // formatted phone numbers
  /\S+@\S+\.\S+/,                              // emails
  /(http|https):\/\/[^\s]+/,                   // links
  /\b(paypal|venmo|upi|bank|transfer)\b/i      // payment keywords
];

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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roomId = `${gigId}_${posterId}_${applicantId}`;

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!userId || !roomId) return;

    createChatIfNotExists(roomId, gigId, [applicantId, posterId]);

    const q = query(
      collection(db, `chats/${roomId}/messages`),
      orderBy("timestamp")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data() as ChatMessage);
      setMessages(msgs);
    });

    return () => unsub();
  }, [userId, roomId, gigId, applicantId, posterId]);

  const handleSend = async () => {
    if (!message.trim()) return;

    // ✅ Restriction check
    const violates = restrictedPatterns.some((pattern) => pattern.test(message));
    if (violates) {
      setError(
        "⚠️ For your safety, please do not share personal contact details, payment info, or external links. Use GigsWall only."
      );
      return;
    }

    setError(null);
    await sendMessageToFirestore(roomId, message, userId, recipient);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-5 right-5 bg-white border shadow-lg rounded-xl w-80 z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <p className="font-semibold text-[#3B2ECC]">Chat</p>
        <button
          onClick={() => setOpenChatForGig(null)}
          className="text-gray-500 hover:text-red-600 text-xl"
        >
          ✖
        </button>
      </div>



      {/* Messages */}
      <div className="h-64 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, idx) => {
          const formattedTime = msg.timestamp
            ? new Date(msg.timestamp?.toDate?.() ?? msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Sending...";

          return (
            <div key={idx} className="flex flex-col">
              <div
                className={`text-sm px-3 py-2 rounded-lg max-w-[75%] ${
                  msg.sender === userId
                    ? "bg-[#4B55C3] text-white ml-auto"
                    : "bg-gray-200 text-black mr-auto"
                }`}
              >
                {msg.message}
              </div>
              <span
                className={`text-[10px] text-gray-500 mt-0.5 ${
                  msg.sender === userId ? "text-right pr-1" : "text-left pl-1"
                }`}
              >
                {formattedTime}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-3 py-1 text-xs text-red-600 border-t bg-red-50">{error}</div>
      )}

      {/* Input */}
      <div className="flex items-center border-t px-2 py-2">
        <input
          type="text"
          className="flex-1 text-sm px-3 py-2 border rounded-lg focus:outline-none"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          className="ml-2 px-3 py-2 rounded-lg text-sm bg-[#3B2ECC] text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;