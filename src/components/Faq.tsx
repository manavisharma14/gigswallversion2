'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type FAQ = {
  question: string;
  answer: string;
};

const faqList: FAQ[] = [
  {
    question: 'Who can use GigsWall?',
    answer:
      'GigsWall is a student freelancing platform. If you’re a college student looking to earn from your skills or get help with tasks — you’re welcome to join.',
  },
  {
    question: 'Is GigsWall free to use?',
    answer:
      'Yes! Posting gigs, browsing opportunities, and applying is completely free for all verified students.',
  },
  {
    question: 'What kind of gigs can I post?',
    answer:
      'You can post anything you need help with — from design, writing, tutoring, and tech work to event help or local errands. Just keep it student-friendly and safe.',
  },
  {
    question: 'How do I get paid?',
    answer:
      'Payment is handled directly between students. Common options include UPI (Google Pay, PhonePe, Paytm), bank transfer, or cash in person. Always agree on terms clearly before starting.',
  },
  {
    question: 'How do I contact someone after applying or being accepted?',
    answer:
      'Once your application is accepted, a chat option will be enabled so you can directly communicate with the gig poster.',
  },
  {
    question: 'What happens after I apply to a gig?',
    answer:
      'The gig poster will review your application and may accept or reject it. You’ll be notified once a decision is made.',
  },
];

export default function FaqPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <main id="faq" className="min-h-screen bg-white px-4 sm:px-6 md:px-24 py-16 sm:py-20 font-bricolage">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-14 sm:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#4B55C3] to-[#6366F1]">
        Frequently Asked Questions
      </h1>

      <section className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
        {faqList.map((faq, index) => {
          const isOpen = activeIndex === index;

          return (
            <div
              key={index}
              className="rounded-xl bg-gradient-to-br from-[#f5f7ff] to-[#eaefff] shadow-md transition-all duration-300"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex justify-between items-center px-5 sm:px-6 py-4 sm:py-5 text-left group focus:outline-none"
                aria-expanded={isOpen}
                aria-controls={`faq-${index}`}
              >
                <span className="text-base sm:text-lg md:text-xl font-semibold text-[#4B55C3] group-hover:text-[#6366F1] transition">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-[#4B55C3] transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                id={`faq-${index}`}
                className={`px-5 sm:px-6 pb-4 sm:pb-5 transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
