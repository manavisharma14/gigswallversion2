'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const extraQuestions = [
  { key: 'skills', text: '💡 What are some skills you’re confident in? (e.g. React, Writing, Excel)' },
  { key: 'interests', text: '🎯 What kind of gigs excite you the most?' },
  { key: 'experienceLevel', text: '📊 How would you describe your experience level? (Beginner / Intermediate / Advanced)' },
  { key: 'portfolio', text: '🌐 Do you have a portfolio, GitHub, or LinkedIn link to share?' },
  { key: 'availability', text: '🕒 How many hours per week can you dedicate to gigs?' },
  { key: 'location', text: '📍 Where are you currently located (city or campus)?' },
  { key: 'goals', text: '🚀 What’s your main goal for joining GigsWall? (e.g. learn skills, earn money, network)' },
];

export default function ProfileQuestionsModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      addBot('👋 Hey again! Let’s make your profile stand out a little more.');
      setTimeout(() => addBot(extraQuestions[0].text), 1200);
    }
  }, [open]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBot = (text: string) => setMessages((m) => [...m, { sender: 'bot', text }]);
  const addUser = (text: string) => setMessages((m) => [...m, { sender: 'user', text }]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const current = extraQuestions[step];
    addUser(input);
    const newAnswers = { ...answers, [current.key]: input };
    setAnswers(newAnswers);
    setInput('');

    if (step < extraQuestions.length - 1) {
      setStep(step + 1);
      setTimeout(() => addBot(extraQuestions[step + 1].text), 600);
    } else {
      addBot('✨ Great! Let’s save these details to your profile...');
      await saveProfile(newAnswers);
    }
  };

  const saveProfile = async (answers: Record<string, string>) => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/update-profile-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...answers }),
      });

      if (res.ok) {
        addBot('✅ Done! Your profile looks amazing now 🎉');
        setTimeout(() => {
          setOpen(false);
          onClose();
        }, 1500);
      } else {
        addBot('⚠️ Something went wrong while saving. Please try again.');
      }
    } catch {
      addBot('❌ Network error while saving.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col h-[600px] overflow-hidden"
        >
          <div className="bg-[#4B55C3] text-white px-5 py-3 font-semibold flex justify-between items-center">
            <span>Chat with GigsWall 🤖</span>
            <button onClick={() => setOpen(false)} className="text-white hover:opacity-80">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[80%] shadow-sm ${
                    msg.sender === 'bot'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-[#4B55C3] text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 flex gap-2 border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || step >= extraQuestions.length}
              placeholder={
                step < extraQuestions.length
                  ? 'Type your answer...'
                  : 'All done 🎉'
              }
              className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4B55C3]"
            />
            <button
              type="submit"
              disabled={loading || step >= extraQuestions.length}
              className="bg-[#4B55C3] text-white px-5 py-3 rounded-xl hover:bg-[#3B2ECC] transition disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}