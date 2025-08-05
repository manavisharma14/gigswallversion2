'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

// ───────────────────────────────────
// OPTIONS  (first item = placeholder)
// ───────────────────────────────────
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

// ───────────────────────────────────
// TYPES
// ───────────────────────────────────
type GigForm = {
  title: string;
  description: string;
  category: string;        // always a string now
  budget: string;
  postedById?: string;
  college?: string;
};

type FormErrors = {
  title?: string;
  description?: string;
  category?: string;
  budget?: string;
};

// ───────────────────────────────────
// COMPONENT
// ───────────────────────────────────
export default function PostGigClient() {
  const router = useRouter();

  // ---------- state ----------
  const [form, setForm] = useState<GigForm>(() => {
    if (typeof window !== 'undefined') {
      return {
        title       : '',
        description : '',
        category    : 'Select Category',         // ✅ valid from first render
        budget      : '',
        postedById  : localStorage.getItem('userId')   || '',
        college     : localStorage.getItem('college')  || 'MIT Manipal',
      };
    }
    return { title:'', description:'', category:'Select Category', budget:'' };
  });

  const [errors, setErrors]  = useState<FormErrors>({});
  const [submitting, setSub] = useState(false);

  // ---------- helper ----------
  const isGibberish = (txt: string) => {
    const vowels = txt.match(/[aeiou]/gi)?.length ?? 0;
    const words  = txt.trim().split(/\s+/).length;
    const avgLen = txt.length / words;
    return vowels < 4 || avgLen > 12 || words < 4;
  };

  // ---------- validation ----------
  const validate = () => {
    const e: FormErrors = {};

    if (!form.title.trim() || form.title.length < 5 || form.title.length > 100)
      e.title = 'Title must be 5–100 characters.';
    else if (isGibberish(form.title))
      e.title = 'Please enter a clear, meaningful title.';

    if (!form.description.trim() || form.description.length < 50)
      e.description = 'Description should be at least 50 characters.';
    else if (isGibberish(form.description))
      e.description = 'Please enter a clear, meaningful description.';

    if (form.category === 'Select Category')
      e.category = 'Please select a category.';

    const n = Number(form.budget);
    if (Number.isNaN(n) || n < 100 || n > 100_000)
      e.budget = 'Enter a valid budget (₹100 – ₹100 000).';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---------- submit ----------
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    const { Filter } = await import('bad-words');   // client-only
    const filter     = new Filter();
    if (filter.isProfane(form.title) || filter.isProfane(form.description)) {
      toast.error('Please remove inappropriate language.');
      return;
    }

    const spam = ['asdf','qwer','spam','nonsense'];
    if (spam.some(w => `${form.title} ${form.description}`.toLowerCase().includes(w))) {
      toast.error('Your post seems spammy. Please revise it.');
      return;
    }

    const token  = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      toast.error('Please log in to post a gig.');
      return;
    }

    setSub(true);
    const res = await fetch('/api/gigs', {
      method : 'POST',
      headers: { 'Content-Type':'application/json' },
      body   : JSON.stringify({
        ...form,
        budget    : Number(form.budget),
        postedById: userId,
        status    : 'open',
      }),
    });
    setSub(false);

    if (res.ok) {
      toast.success('Gig posted successfully!');
      router.push('/gigs');
    } else {
      toast.error('Failed to post gig. Try again.');
    }
  };

  // ---------- render ----------
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
              name="title"
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Logo Design for Club"
              maxLength={100}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4B55C3] focus:outline-none"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold text-[#4B55C3]">Description</label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what the gig involves..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4B55C3] focus:outline-none"
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* Category */}
          {/* ---------- Category ---------- */}
          <div>
  <label className="block mb-1 font-semibold text-[#4B55C3]">Category</label>
  <Listbox
    value={form.category}
    onChange={(val) => {
      if (val !== form.category) {
        setForm({ ...form, category: val });
      }
    }}
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
                {selected && (
                  <CheckIcon className="w-5 h-5 inline ml-2 text-[#4B55C3]" />
                )}
              </span>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
  {errors.category && (
    <p className="text-sm text-red-600 mt-1">{errors.category}</p>
  )}
</div>

          {/* Budget */}
          <div>
            <label className="block mb-1 font-semibold text-[#4B55C3]">Budget (₹)</label>
            <input
              name="budget"
              type="number"
              value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })}
              placeholder="e.g., 1000"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4B55C3] focus:outline-none"
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