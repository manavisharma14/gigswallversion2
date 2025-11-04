'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const questions = [
  { key: 'college', label: "What is your college?", placeholder: 'e.g. University of Kansas' },
  { key: 'department', label: "What is your department or major?", placeholder: 'e.g. Computer Science' },
  { key: 'gradYear', label: 'When will you graduate?', placeholder: 'e.g. 2026' },
  { key: 'phone', label: 'Your phone number?', placeholder: '+1 (555) 123-4567' },
];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({ college: '', department: '', gradYear: '', phone: '' });
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNext = () => {
    if (!form[questions[step].key as keyof typeof form]) {
      showToast('Please fill this field before continuing', 'error');
      return;
    }
    if (step < questions.length - 1) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast('Profile completed! ', 'success');
        router.refresh();
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        const data = await res.json();
        showToast(data.message || 'Failed to save', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const current = questions[step];

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col items-center justify-center px-6 font-bricolage">
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <button
        onClick={() => (step > 0 ? setStep(step - 1) : router.back())}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#4B55C3] hover:text-[#3B2ECC] transition"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back
      </button>

      <div className="max-w-lg w-full text-center space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#3B2ECC]">{`Let's get to know you 👋`}</h1>
        <p className="text-gray-600 text-lg">Answer a few quick questions to complete your student profile.</p>

        <div className="mt-10 relative min-h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <label className="block text-xl font-semibold mb-4 text-[#3B2ECC]">{current.label}</label>
              <input
                type="text"
                value={form[current.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [current.key]: e.target.value })}
                placeholder={current.placeholder}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:border-[#4B55C3] transition"
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          disabled={loading}
          className="mt-6 px-8 py-3 bg-[#4B55C3] text-white rounded-xl font-medium hover:bg-[#3B2ECC] transition disabled:opacity-50"
        >
          {step < questions.length - 1 ? 'Next →' : loading ? 'Saving...' : 'Finish '}
        </button>

        <div className="mt-6 text-gray-500 text-sm">
          Step {step + 1} of {questions.length}
        </div>
      </div>
    </div>
  );
}