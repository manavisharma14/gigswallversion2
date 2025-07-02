export default function HowItWorks() {
  const steps = [
    {
      title: '1. Post a Gig',
      description: 'Share tasks you need help with — like tutoring, design, or errands.',
    },
    {
      title: '2. Browse Opportunities',
      description: 'Discover student gigs that match your skills and availability.',
    },
    {
      title: '3. Get Paid',
      description: 'Help others, grow your experience, and earn money doing what you’re good at.',
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-white text-center px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4B55C3] mb-12 sm:mb-16 font-bricolage">
        How It Works
      </h2>

      {/* Steps Grid */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 sm:gap-10 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-[#4B55C3] via-[#6366F1] to-[#7C83F9] text-white font-bricolage rounded-3xl p-6 sm:p-8 w-full max-w-sm mx-auto shadow-xl ring-1 ring-white/10 backdrop-blur-sm transition-transform duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(99,102,241,0.4)]"
          >
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 drop-shadow-md">
              {step.title}
            </h3>
            <p className="text-white text-opacity-95 leading-relaxed text-sm sm:text-base md:text-lg">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
