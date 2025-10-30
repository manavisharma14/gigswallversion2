'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Listbox } from '@headlessui/react';


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
  const { data: session } = useSession();

  const [form, setForm] = useState<GigForm>({
    title: '',
    description: '',
    category: 'Select Category',
    budget: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // ─────────── Validation ───────────
  const validate = () => {
    const e: FormErrors = {};

    if (!form.title.trim() || form.title.length < 5)
      e.title = 'Title must be at least 5 characters.';
    if (!form.description.trim() || form.description.length < 50)
      e.description = 'Description must be at least 50 characters.';
    if (form.category === 'Select Category')
      e.category = 'Please select a category.';
    const n = Number(form.budget);
    if (Number.isNaN(n) || n < 100)
      e.budget = 'Enter a valid budget (₹100 or more).';

    setErrors(e);
    return Object.keys(e).length === 0;
  };


  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!validate()) return;
  
    if (!session?.user?.id) {
      toast.error('You must be logged in to post a gig.');
      return;
    }
  
    try {
      setSubmitting(true);
  
      const res = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget),
        }),
      });
  
      if (!res.ok) throw new Error('Request failed');
  
      toast.success('Gig posted successfully!');
      router.push('/gigs');
  
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unexpected error';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };


  return (
<div className="min-h-screen bg-gradient-to-b from-[#F7F8FF] to-white pt-28 pb-20 px-4 font-bricolage text-gray-900">

<div className="max-w-3xl mx-auto border border-gray-200 rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm p-8">
  {/* Page Header */}
  <div className="mb-10">
    <h1 className="text-4xl font-extrabold text-[#4B55C3] tracking-tight">
      Create a Gig 
    </h1>
    <p className="text-gray-500 mt-2 text-lg">
      Connect with talented students across campus.
    </p>
  </div>

  <form onSubmit={handleSubmit} className="space-y-10">

    {/* Title */}
    <div className="group">
      <label className="font-semibold text-gray-700">Gig Title</label>
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="mt-2 w-full bg-transparent border-b-2 border-gray-300 
          focus:border-[#8A92FF] transition-all pb-2 text-lg outline-none
          group-hover:border-gray-400"
        placeholder="e.g., Help design a college event poster "
      />
      {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
    </div>

    {/* Description */}
    <div className="group">
      <label className="font-semibold text-gray-700">Description</label>
      <textarea
        rows={5}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="mt-2 w-full bg-transparent border-b-2 border-gray-300 
          focus:border-[#8A92FF] transition-all pb-2 text-lg resize-none outline-none
          group-hover:border-gray-400"
        placeholder="Share project details, expectations & timeline "
      />
      {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
    </div>

    {/* Category */}
    <div className="group">
      <label className="font-semibold text-gray-700">Category</label>

      <Listbox
        value={form.category}
        onChange={(val) => setForm({ ...form, category: val })}
      >
        <Listbox.Button className="mt-2 w-full border-b-2 border-gray-300 pb-2 text-lg text-left outline-none
          focus:border-[#8A92FF] transition-all bg-transparent group-hover:border-gray-400">
          {form.category}
        </Listbox.Button>

        <Listbox.Options className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 max-h-64 overflow-auto">
          {categories.map((opt) => (
            <Listbox.Option
              key={opt}
              value={opt}
              className={({ active }) =>
                `cursor-pointer select-none p-2 rounded-lg text-sm ${
                  active ? 'bg-[#EEF1FF] text-[#4B55C3]' : 'text-gray-800'
                }`
              }
            >
              {({ selected }) => (
                <span className={selected ? 'font-semibold' : 'font-normal'}>
                  {opt}
                </span>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>

      {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
    </div>

    {/* Budget */}
    <div className="group">
      <label className="font-semibold text-gray-700">Budget (₹)</label>
      <input
        type="number"
        value={form.budget}
        onChange={(e) => setForm({ ...form, budget: e.target.value })}
        className="mt-2 w-full bg-transparent border-b-2 border-gray-300 
          focus:border-[#8A92FF] transition-all pb-2 text-lg outline-none
          group-hover:border-gray-400"
        placeholder="Budget"
      />
      {errors.budget && <p className="text-sm text-red-500 mt-1">{errors.budget}</p>}
    </div>

    {/* Button */}
    <button
      type="submit"
      disabled={submitting}
      className={`w-full py-3 text-lg font-semibold rounded-xl shadow-md transition
        bg-[#4B55C3] hover:bg-[#6673FF] text-white active:scale-[0.98] 
        ${submitting && 'opacity-60 cursor-not-allowed'}
      `}
    >
      {submitting ? 'Posting…' : 'Post Gig 🚀'}
    </button>

  </form>
</div>
</div>
  );
}