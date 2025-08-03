import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
    getDocs,
    query,
    orderBy,
  } from "firebase/firestore";
  import { db } from "./firebase";
  
  export const createChatIfNotExists = async (
    roomId: string,
    gigId: string,
    participants: string[]
  ) => {
    try {
      const chatRef = doc(db, "chats", roomId);
      const chatSnap = await getDoc(chatRef);
  
      if (!chatSnap.exists()) {
        console.log(`[createChatIfNotExists] Creating new chat for roomId: ${roomId}`);
        await setDoc(chatRef, {
          gigId,
          participants,
          updatedAt: serverTimestamp(),
          lastMessage: "",
        });
      } else {
        console.log(`[createChatIfNotExists] Chat already exists: ${roomId}`);
      }
    } catch (err) {
      console.error("[createChatIfNotExists] Error:", err);
    }
  };
  
  export const sendMessageToFirestore = async (
    roomId: string,
    message: string,
    sender: string,
    recipient: string
  ) => {
    try {
      const messagesRef = collection(db, `chats/${roomId}/messages`);
      const messageDoc = await addDoc(messagesRef, {
        message,
        sender,
        recipient,
        timestamp: serverTimestamp(),
      });
  
      console.log(`[sendMessageToFirestore] Message sent (doc ID: ${messageDoc.id}):`, {
        roomId,
        message,
        sender,
        recipient,
      });
  
      await updateDoc(doc(db, "chats", roomId), {
        lastMessage: message,
        updatedAt: serverTimestamp(),
      });
  
      console.log("[sendMessageToFirestore] Chat metadata updated");
    } catch (err) {
      console.error("[sendMessageToFirestore] Error sending message:", err);
    }
  };