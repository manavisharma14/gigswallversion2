/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // ✅ Fetch the blog dynamically from your API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}`, {
    // Revalidate every 60s so data is not cached forever
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return notFound();
  }

  const blog = await res.json();

  if (!blog) return notFound();

  const formattedDate = new Date(blog.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto p-6 pt-32">
      {blog.coverImg && (
        <img
          src={blog.coverImg}
          alt={blog.title}
          className="w-full h-60 object-cover rounded-xl mb-6"
        />
      )}
      <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{formattedDate}</p>

      <div className="flex items-center gap-2 mb-6">
        <img
          src={blog.authorImage}
          alt={blog.authorName}
          className="w-9 h-9 rounded-full"
        />
        <p className="text-sm text-gray-500">{blog.authorName}</p>
      </div>

      <p className="whitespace-pre-line leading-relaxed text-lg text-gray-700">
        {blog.content}
      </p>
    </div>
  );
}