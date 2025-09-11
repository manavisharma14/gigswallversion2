/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// ✅ Hardcoded blogs
const blogs: any = {
  "manavi-story": {
    title: "Still Learning. Still Building.",
    coverImg: "/assets/blog1.png",
    content: `I’m Manavi Sharma, and I grew up in Gurgaon. As a kid, I wasn’t the most curious person, more of a daydreamer than anything else. Basketball was where I felt most alive, and the court was my space to reset. At different points, I imagined myself becoming a doctor, an astronomer, or maybe even a teacher. 
  
The first real spark for building came in the second year of my undergrad. By then, I was tired of making projects just for the sake of learning, stacking them up on my laptop without ever seeing them go anywhere. At the same time, I kept trying to land freelancing gigs on global platforms, but it always felt impossible to even get noticed. The doors stayed shut.  
  
That’s when GigsWall began to take shape. One late night, too many tabs open, deadlines piling up, my brain foggy with “productivity”, I thought: what if there was something simpler? Not another massive, overwhelming system, but a platform that actually made sense for students. A place where students like me could find gigs, connect, and start small, without disappearing in the noise.  
  
I’m still a student. Still figuring things out. Still Googling errors at 2 AM. And yet, I’m building a platform for students. Some days that feels ridiculous. Other days, it feels like the most honest thing I could do.  
  
One moment that made this real was when the very first student applied for a gig on GigsWall. I remember staring at the screen, realizing someone out there trusted this idea enough to use it. That tiny notification made all the late nights feel worth it.  
  
It’s not perfect. Neither am I. But it’s real. 
  
So here I am, still learning, still building, still here. Sharing not from a place of already knowing, but from a place of trying. 
  
It’s me saying:

“Here’s what I wish I had.”
“Here’s what might make this easier for you.”
“Here’s something from someone who gets it.”

Still messing up. Still trying again.

But maybe that’s the point.`,
    authorName: "Manavi Sharma",
    authorImage: "/assets/manavi1.png",
    createdAt: "2025-09-10",
  },

  "top-freelancing-skills": {
    title: "Top 10 Freelancing Skills Every Student Should Learn in 2025",
    coverImg: "/assets/blog2.jpeg",
    content: `The freelancing economy is booming, and college students are uniquely positioned to capitalize on this trend. 

Students generally have flexible schedules, access to current knowledge, and are digital natives, which means they can easily start generating income while still studying. But which skills should you develop?

Based on market demand and earning potential, here are the top 10 freelancing skills every student should consider mastering in 2025.

1. Content Writing and Copywriting

2. Social Media Management
Earning potential: $300 - $1500 per month per client
Getting started: Manage accounts for student organizations or local businesses.

3. Graphic Design
Earning potential: $25-75 per project, and $25-50 per hour

4. Video Editing
Earning potential: $30-80 per hour, $100-500 per project

5. Web Development
Earning potential: $40-100+ per hour, $500-5000+ per project

6. Data Analysis and Research
Earning potential: $25-60 per hour

7. Online Tutoring and Academic Support
Earning potential: $15-50 per hour

8. Virtual Assistance
Earning potential: $15-35 per hour

9. Photography and Photo Editing
Earning potential: $50-200 a session, $20-50 per hour for editing

10. Translation and Language Services
Earning potential: $15-40 per hour, $0.10-0.25 per word.

Start small and identify 1-2 skills that fit your interests. Develop a portfolio by participating in campus projects, collecting testimonials, and gradually increasing rates. The best first clients are fellow students and campus organizations. They understand what it’s like to juggle a busy lifestyle with school, and they want to help someone just getting started.

Ready to put these skills to work? GigsWall connects students with peers who need exactly what you offer, creating opportunities to earn, learn, and grow together.

Sign up today!`,
    authorName: "Shrishti",
    authorImage: "/assets/shrishti.png",
    createdAt: "2025-09-10",
  },
};


export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const blog = blogs[params.id];
  if (!blog) return {};

  return {
    title: `${blog.title} | GigsWall Blog`,
    description: blog.description,
    keywords: blog.keywords,
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: [blog.coverImg],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: [blog.coverImg],
    },
  };
}


// ✅ Fix: async component, unwrap params
export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = blogs[id];

  if (!blog) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6 pt-32">
      <img
        src={blog.coverImg}
        alt={blog.title}
        className="w-full h-60 object-cover rounded-xl mb-6"
      />
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <div className="flex items-center gap-2 mb-6">
        <img
          src={blog.authorImage}
          alt={blog.authorName}
          className="w-9 h-9 rounded-full"
        />
        <p className="text-sm text-gray-500">
          {blog.authorName} • {new Date(blog.createdAt).toLocaleDateString()}
        </p>
      </div>
      <p className="whitespace-pre-line leading-relaxed text-lg text-gray-700">
        {blog.content}
      </p>
    </div>
  );
}