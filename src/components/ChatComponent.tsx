"use client";

import { useEffect, useRef, useState } from "react";
import { Timestamp, collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendMessageToFirestore, createChatIfNotExists } from "@/lib/firebaseChat";
import { uploadChatFile } from "@/lib/uploadChatFile"; // ✅ Server upload + progress


type ChatType = "TEXT" | "FILE" | "DELIVERY";

interface ChatMessage {
  message: string;
  sender: string;
  recipient: string;
  timestamp?: Timestamp;
  type?: ChatType;
  attachments?: Array<{ name: string; url: string; size?: number }>;
}

const restrictedPatterns = [
  /\b\d{10}\b/,
  /\b\d{3}[-.\s]??\d{3}[-.\s]??\d{4}\b/,
  /\S+@\S+\.\S+/,
  /(http|https):\/\/[^\s]+/,
  /\b(paypal|venmo|upi|bank|transfer)\b/i,
];

export default function ChatComponent({
  gigId,
  applicantId,
  posterId,
  recipient,
  escrowPaid,
  setOpenChatForGig,
  applicationId,
}: {
  gigId: string;
  applicantId: string;
  posterId: string;
  recipient: string;
  escrowPaid: boolean;
  setOpenChatForGig: (v: string | null) => void;
  applicationId: string;
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [deliveryFile, setDeliveryFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submittingDelivery, setSubmittingDelivery] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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

    const q = query(collection(db, `chats/${roomId}/messages`), orderBy("timestamp"));
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data() as ChatMessage);
      setMessages(msgs);
    });
    return () => unsub();
  }, [userId, roomId, gigId, applicantId, posterId]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const violates = restrictedPatterns.some((p) => p.test(message));
    if (violates) {
      setError("⚠️ Please do not share contact/payment details or external links.");
      return;
    }
    setError(null);
    await sendMessageToFirestore(roomId, message, userId, recipient, { type: "TEXT" });
    setMessage("");
  };

  const handleAttachFile = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      const uploaded = await uploadChatFile(roomId, file, (pct) => {
        setUploadProgress(pct);
      });

      await sendMessageToFirestore(roomId, file.name, userId, recipient, {
        type: "FILE",
        attachments: [{ name: uploaded.name, url: uploaded.url, size: uploaded.size }],
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Upload failed.");
      }
    } finally {
      setUploading(false);
      setUploadProgress(null);
      e.target.value = "";
    }
  };

  const submitDelivery = async () => {
    // if (!escrowPaid) {
    //   setError("Escrow required to deliver work.");
    //   return;
    // }
    if (!deliveryFile) {
      setError("Attach at least one file.");
      return;
    }

    setError(null);
    setSubmittingDelivery(true);

    try {
      const uploaded = await uploadChatFile(roomId, deliveryFile, (pct) =>
        setUploadProgress(pct)
      );

      await sendMessageToFirestore(roomId, deliveryNote || "Work Delivered", userId, recipient, {
        type: "DELIVERY" satisfies ChatType,
        attachments: [{ name: uploaded.name, url: uploaded.url, size: uploaded.size }],
      });

      await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workSubmitted: true }),
      });

      setShowDeliverModal(false);
      setDeliveryNote("");
      setDeliveryFile(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Upload failed.");
      }
    }finally {
      setSubmittingDelivery(false);
    }
  };

  const timeFormat = (ts: Timestamp | Date | null | undefined) =>
    new Date(ts instanceof Timestamp ? ts.toDate() : ts ?? Date.now())
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
<div className="fixed bottom-5 right-5 bg-white border shadow-lg rounded-xl w-[450px]
 z-50 flex flex-col">
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <p className="font-semibold text-[#3B2ECC]">Chat</p>
        {escrowPaid && userId === applicantId && (
          <button onClick={() => setShowDeliverModal(true)}
            className="text-xs bg-purple-600 text-white px-2 py-1 rounded"
          >
            Deliver Work
          </button>
        )}
        <button onClick={() => setOpenChatForGig(null)} className="text-xl text-gray-500 hover:text-red-500">
          ✖
        </button>
      </div>

      {!true && (
        <div className="text-xs text-amber-600 bg-amber-50 border-b border-amber-200 p-2 text-center">
          ⚠️ Escrow pending — file upload disabled
        </div>
      )}

      <div className="h-64 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => {
          const mine = msg.sender === userId;
          const time = msg.timestamp ? timeFormat(msg.timestamp) : "…";

          if (msg.type === "FILE" || msg.type === "DELIVERY") {
            return (
              <div key={i} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                <div className={`px-3 py-2 rounded-lg text-sm border
                  ${msg.type === "DELIVERY" ? "bg-purple-100" : "bg-gray-100"}`}>
                  <b>{msg.type === "DELIVERY" ? "📦 Work Delivered" : "📎 File"}</b>
                  {msg.message && <div>{msg.message}</div>}
                  {msg.attachments?.map((a, idx) => (
                    <div key={idx} className="underline text-xs mt-1">
                      <a href={a.url} target="_blank">{a.name}</a>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-gray-500">{time}</span>
              </div>
            );
          }

          return (
            <div key={i} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              <div className={`px-3 py-2 rounded-lg text-sm ${mine ? "bg-[#4B55C3] text-white" : "bg-gray-200 text-black"}`}>
                {msg.message}
              </div>
              <span className="text-[10px] text-gray-500">{time}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="px-2 py-1 text-xs bg-red-50 text-red-600">{error}</div>}

      {showDeliverModal && (
        <div className="absolute bottom-16 left-2 right-2 bg-white border rounded-lg shadow p-3">
          <input type="file" onChange={(e) => setDeliveryFile(e.target.files?.[0] ?? null)}
            className="w-full text-xs mt-2" />
          <textarea rows={3} value={deliveryNote} onChange={(e) => setDeliveryNote(e.target.value)}
            className="w-full border rounded p-2 text-sm mt-2" placeholder="Add delivery note" />
          <button onClick={submitDelivery}
            disabled={submittingDelivery}
            className="w-full bg-purple-600 text-white text-sm py-1.5 rounded mt-2">
            {submittingDelivery ? "Submitting..." : "Submit Delivery"}
          </button>
        </div>
      )}

{/* Chat Input Footer */}
<div className="border-t px-2 py-2">
  <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2">
    
    {/* Attach */}
    <label className="text-sm bg-gray-100 px-2 py-1 rounded cursor-pointer">
      📎
      <input type="file" className="hidden" onChange={handleAttachFile} />
    </label>

    {/* Input + Upload Bar */}
    <div className="flex flex-col w-full">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type a message"
        className="text-sm px-3 py-2 border rounded-lg w-full"
      />

      {/* Upload progress bar */}
      {uploading && (
        <div className="h-1 bg-gray-200 rounded mt-1 overflow-hidden">
          <div
            className="h-full bg-[#3B2ECC] transition-all"
            style={{ width: `${uploadProgress || 0}%` }}
          />
        </div>
      )}
    </div>

    {/* Send Button */}
    <button
      onClick={handleSend}
      className="px-3 py-2 bg-[#3B2ECC] text-white rounded-lg text-sm"
    >
      Send
    </button>
  </div>
</div>
    </div>
  );
}