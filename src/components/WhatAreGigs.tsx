// app/what-is-a-gig/page.tsx
import Link from 'next/link';
import { ArrowRightIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What is a Gig? – Gigswall',
  description:
    'Learn what a gig is, how it differs from a traditional job, and why Gigswall is the perfect place to find or post short-term projects.',
};

export default function WhatAreGigs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero */}
      <section className="px-6 py-16 md:py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-indigo-900 mb-6">
            What is a <span className="text-indigo-600">Gig</span>?
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            A gig is a <strong>short-term, flexible job</strong> you can take on for pay – think of it as a
            project-based side hustle that fits <strong>your</strong> schedule.
          </p>
          <Link
            href="/gigs"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition"
          >
            Explore Gigs <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Visual Comparison */}
      <section className="px-6 py-12 bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-10">
            Gig vs Traditional Job
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional Job */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8">
              <h3 className="flex items-center gap-2 text-xl font-medium text-gray-800 mb-4">
                <ClockIcon className="h-6 w-6 text-gray-600" />
                Traditional Job
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <XCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  Full-time, permanent (40 h/week)
                </li>
                <li className="flex items-start gap-2">
                  <XCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  Fixed salary + benefits
                </li>
                <li className="flex items-start gap-2">
                  <XCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  One employer, set hours
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  Long-term security
                </li>
              </ul>
            </div>

            {/* Gig */}
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-8">
              <h3 className="flex items-center gap-2 text-xl font-medium text-indigo-800 mb-4">
                <CheckCircleIcon className="h-6 w-6 text-indigo-600" />
                Gig Work
              </h3>
              <ul className="space-y-3 text-indigo-900">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  Short-term / project-based
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  Pay per task 
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  Multiple clients, work anywhere
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  Total schedule flexibility
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* CTA */}
      <section className="px-6 py-16 bg-indigo-600 text-white text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Gig?
          </h2>
          <p className="text-lg mb-8">
            {`Whether you’re a student looking for quick cash or a business needing fast help,
            Gigswall makes it simple.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/gigs"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-indigo-700 font-medium hover:bg-gray-100 transition"
            >
              {`I’m a Student`}
            </Link>
            <Link
              href="/post"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-700 px-6 py-3 text-white font-medium border border-white hover:bg-indigo-800 transition"
            >
              {`I’m a Business`}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}