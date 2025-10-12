'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

export const categories = [
  'Select Category',
  'Design & Creative',
  'Web / App Development',
  'Tutoring & Mentorship',
  'Writing & Translation',
  'Editing & Proof-reading',
  'Photo / Video / Multimedia',
  'Digital Marketing & Social',
  'IT / Tech Support',
  'Resume & Presentation Help',
  'Research & Lab Assistance',
  'Data & Analytics',
  'Event Help & Logistics',
  'Admin & Virtual Assistance',
  'Other',
];

type GigForm = {
  title: string;
  description: string;
  category: string;
  budget: string;
};

type FormErrors = Partial<GigForm>;

export default function PostGigClient() {
  const router = useRouter();
  const { data: session, status } = useSession(); // ✅ NextAuth session

  const [form, setForm] = useState<GigForm>({
    title: '',
    description: '',
    category: 'Select Category',
    budget: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // ⛔ If user not logged in
  if (status === 'unauthenticated') {
    return (
      <div className="pt-24 text-center">
        <h2 className="text-2xl font-bold">You must be logged in to post a gig.</h2>
      </div>
    );
  }

  // ─────────── Validation ───────────
  const validate = () => {
    const e: FormErrors = {};

    if (!form.title.trim() || form.title.length < 5) e.title = 'Title must be at least 5 characters.';
    if (!form.description.trim() || form.description.length < 50) e.description = 'Description must be at least 50 characters.';
    if (form.category === 'Select Category') e.category = 'Please select a category.';
    const n = Number(form.budget);
    if (Number.isNaN(n) || n < 100) e.budget = 'Enter a valid budget (₹100 or more).';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─────────── Submit ───────────
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    if (!session?.user?.id) {
      toast.error('You must be logged in to post a gig.');
      return;
    }

    setSubmitting(true);
    const res = await fetch('/api/gigs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        budget: Number(form.budget),

      }),
    });
    setSubmitting(false);

    if (res.ok) {
      toast.success('Gig posted successfully!');
      router.push('/gigs');
    } else {
      toast.error('Failed to post gig. Try again.');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-10 text-gray-800 font-bricolage">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-[#4B55C3]">
          Post a <span className="text-black">New Gig</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block mb-1 font-semibold text-[#4B55C3]">Gig Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4B55C3] focus:outline-none"
              placeholder="e.g., Logo Design for Club"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold text-[#4B55C3]">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4B55C3] focus:outline-none"
              placeholder="Describe what the gig involves..."
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-semibold text-[#4B55C3]">Category</label>
            <Listbox
              value={form.category}
              onChange={(val) => setForm({ ...form, category: val })}
            >
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-3 pl-4 pr-10 text-left border border-gray-300 focus:ring-2 focus:ring-[#4B55C3] focus:outline-none">
                  <span className="block truncate">{form.category}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronUpDownIcon className="h-5 w-5 text-[#4B55C3]" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white text-base shadow-xl ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {categories.map((opt) => (
                    <Listbox.Option
                      key={opt}
                      value={opt}
                      className={({ active }) =>
                        `cursor-pointer select-none py-2 px-4 ${
                          active ? 'bg-[#E9ECFF] text-[#4B55C3]' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <span className={selected ? 'font-medium' : 'font-normal'}>
                          {opt}
                          {selected && <CheckIcon className="w-5 h-5 inline ml-2 text-[#4B55C3]" />}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
            {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
          </div>

          {/* Budget */}
          <div>
            <label className="block mb-1 font-semibold text-[#4B55C3]">Budget (₹)</label>
            <input
              type="number"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4B55C3] focus:outline-none"
              placeholder="e.g., 1000"
            />
            {errors.budget && <p className="text-sm text-red-600 mt-1">{errors.budget}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 font-semibold rounded-xl text-white shadow-md transition ${
              submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4B55C3] hover:bg-[#5C53E5]'
            }`}
          >
            {submitting ? 'Posting…' : 'Submit Gig'}
          </button>
        </form>
      </div>
    </div>
  );
}