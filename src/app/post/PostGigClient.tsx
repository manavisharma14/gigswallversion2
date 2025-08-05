'use client';

import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Filter } from 'bad-words';

// Category options
const categories = [
  '🎨 Creative & Design',
  '💻 Tech & Development',
  '📚 Tutoring & Academic Help',
  '✍️ Writing & Editing',
  '📸 Photography & Videography',
  '📱 Social Media & Marketing',
  '🛠️ Technical Support',
  '🧠 Presentation & Resume Help',
  '🧪 Research Assistance',
  '📊 Data Entry & Analysis',
  'Other',
];

// Type definitions
type GigForm = {
  title: string;
  description: string;
  category: string;
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

export default function PostGigClient() {
  const router = useRouter();

  const [form, setForm] = useState<GigForm>({
    title: '',
    description: '',
    category: '',
    budget: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Load user info from localStorage
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  
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

  if (!isMounted) return null;


  const isGibberish = (text: string): boolean => {
    const vowels = text.match(/[aeiou]/gi)?.length || 0;
    const words = text.trim().split(/\s+/).length;
    const avgWordLength = text.length / words;
  
    return (
      vowels < 4 ||               // Not enough vowels = likely gibberish
      avgWordLength > 12 ||       // Words are too long = junk
      words < 4                   // Too few words = low quality
    );
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
  
    if (!form.title.trim() || form.title.length < 5 || form.title.length > 100) {
      newErrors.title = 'Title must be 5–100 characters.';
    } else if (isGibberish(form.title)) {
      newErrors.title = 'Please enter a clear, meaningful title.';
    }
  
    if (!form.description.trim() || form.description.length < 50) {
      newErrors.description = 'Description should be at least 50 characters.';
    } else if (isGibberish(form.description)) {
      newErrors.description = 'Please enter a clear, meaningful description.';
    }
  
    if (!form.category) {
      newErrors.category = 'Please select a category.';
    }
  
    const budgetNum = Number(form.budget);
    if (!budgetNum || isNaN(budgetNum) || budgetNum < 100 || budgetNum > 100000) {
      newErrors.budget = 'Enter a valid budget (₹100 to ₹100000).';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    const filter = new Filter();
    const containsProfanity =
      filter.isProfane(form.title) || filter.isProfane(form.description);
  
    if (containsProfanity) {
      toast.error('Please remove inappropriate language from your gig.');
      return;
    }
  
    // Optional: simple gibberish/spam check
    const spammyWords = ['asdf', 'qwer', 'spam', 'nonsense'];
    const combinedText = `${form.title} ${form.description}`.toLowerCase();
  
    if (spammyWords.some((word) => combinedText.includes(word))) {
      toast.error('Your post seems spammy. Please revise it.');
      return;
    }
  
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const college = localStorage.getItem('college') || 'MIT Manipal';
  
    if (!token || !userId) {
      toast.error('Please log in to post a gig.');
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
      toast.success('Gig posted successfully!');
      router.push('/gigs');
    } else {
      toast.error('Failed to post gig. Try again.');
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-1 text-gray-800 font-bricolage">
    {/* <div className="max-w-2xl mx-auto mt-10  bg-gradient-to-br from-[#E9ECFF] via-[#EEF1FF] to-[#F6F8FF] border border-gray-200 rounded-2xl shadow-2xl p-8 sm:p-10 pb-10"></div> */}
      <div className="max-w-2xl mx-auto mt-10 bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 sm:p-10 pb-24">
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
              onChange={handleChange}
              placeholder="e.g., Logo Design for Club"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4B55C3] focus:outline-none"
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold text-[#4B55C3]">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what the gig involves..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4B55C3] focus:outline-none"
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-semibold text-[#4B55C3]">Category</label>
            <Listbox value={form.category} onChange={(val) => setForm({ ...form, category: val })}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-3 pl-4 pr-10 text-left border border-gray-300 focus:ring-2 focus:ring-[#4B55C3] focus:outline-none">
                  <span className="block truncate">{form.category || 'Select Category'}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronUpDownIcon className="h-5 w-5 text-[#4B55C3]" />
                  </span>
                </Listbox.Button>

                <Transition as={Fragment}>
                  <Listbox.Options className="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {categories.map((option) => (
                      <Listbox.Option
                        key={option}
                        value={option}
                        className={({ active }) =>
                          `cursor-pointer select-none py-2 px-4 ${
                            active ? 'bg-[#E9ECFF] text-[#4B55C3]' : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <span className={`${selected ? 'font-medium' : 'font-normal'}`}>
                            {option}
                            {selected && (
                              <CheckIcon className="w-5 h-5 inline ml-2 text-[#4B55C3]" />
                            )}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
          </div>

          {/* Budget */}
          <div>
            <label className="block mb-1 font-semibold text-[#4B55C3]">Budget (₹)</label>
            <input
              name="budget"
              type="number"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g., 1000"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4B55C3] focus:outline-none"
            />
            {errors.budget && <p className="text-sm text-red-600 mt-1">{errors.budget}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 font-semibold rounded-xl text-white shadow-md transition ${
              submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4B55C3] hover:bg-[#5C53E5]'
            }`}
          >
            {submitting ? 'Posting...' : 'Submit Gig'}
          </button>
        </form>
      </div>
    </div>
  );
}
