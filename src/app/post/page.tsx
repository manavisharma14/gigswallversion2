'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PostGigPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedCollege = localStorage.getItem('college');

    if (token && storedUserId) {
      setForm((prev) => ({
        ...prev,
        postedById: storedUserId,
        college: storedCollege || 'MIT Manipal',
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const college = localStorage.getItem('college') || 'MIT Manipal';

    if (!token || !userId) {
      alert('🚫 Please log in to post a gig.');
      return;
    }

    setSubmitting(true);

    const res = await fetch('/api/gigs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        budget: parseInt(form.budget),
        college,
        postedById: userId,
        status: 'open',
      }),
    });

    setSubmitting(false);

    if (res.ok) {
      router.push('/gigs');
    } else {
      alert('❌ Failed to post gig');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9ECFF] to-[#F6F8FF] pt-24 px-4 pb-16 text-gray-800 font-bricolage">
      <div className="max-w-2xl mx-auto mt-20 bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-[#4B55C3]">
          Post a <span className="text-black">New Gig</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { name: 'title', placeholder: 'Gig Title', type: 'text' },
            { name: 'description', placeholder: 'Description', type: 'textarea' },
            { name: 'category', placeholder: 'Category', type: 'text' },
            { name: 'budget', placeholder: 'Budget (₹)', type: 'number' },
          ].map((field) =>
            field.type === 'textarea' ? (
              <textarea
                key={field.name}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={field.placeholder}
                rows={4}
                required
                className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-[#4B55C3] focus:outline-none placeholder-gray-500"
              />
            ) : (
              <input
                key={field.name}
                name={field.name}
                type={field.type}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-[#4B55C3] focus:outline-none placeholder-gray-500"
              />
            )
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 font-semibold rounded-xl text-white shadow-md transition ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#3B2ECC] hover:bg-[#5C53E5]'
            }`}
          >
            {submitting ? 'Posting...' : 'Submit Gig'}
          </button>
        </form>
      </div>
    </div>
  );
}
