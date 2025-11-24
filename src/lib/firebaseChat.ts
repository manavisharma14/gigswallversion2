// lib/firebaseChat.ts
import {
  collection, addDoc, serverTimestamp, doc, getDoc, setDoc, updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type ChatAttachment = { name: string; url: string; size?: number; contentType?: string };
export type ChatType = "TEXT" | "FILE" | "DELIVERY";

export async function createChatIfNotExists(
  roomId: string,
  gigId: string,
  participants: string[]
) {
  const ref = doc(db, "chats", roomId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      gigId,
      participants,
      updatedAt: serverTimestamp(),
      lastMessage: "",
    });
  }
}

export async function sendMessageToFirestore(
  roomId: string,
  message: string,
  sender: string,
  recipient: string,
  extra?: { type?: ChatType; attachments?: ChatAttachment[] }
) {
  const payload = {
    type: extra?.type ?? "TEXT",
    message,
    sender,
    recipient,
    attachments: extra?.attachments ?? [],
    timestamp: serverTimestamp(),
  };

  await addDoc(collection(db, `chats/${roomId}/messages`), payload);

  await updateDoc(doc(db, "chats", roomId), {
    lastMessage: payload.type === "FILE" ? `📎 ${message}` : message,
    updatedAt: serverTimestamp(),
  });
}