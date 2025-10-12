/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function BlogsClient({ initialBlogs }: { initialBlogs: any[] }) {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState(initialBlogs);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const [content, setContent] = useState("");
  const [dateOverride, setDateOverride] = useState("");

  const canPost =
    session?.user?.email === "manavisharma14@gmail.com" ||
    session?.user?.email === "manavsharma1280@gmail.com";

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        coverImg,
        content,
        dateOverride: dateOverride || null,
      }),
    });

    if (res.ok) {
      const newBlog = await res.json();
      setBlogs((prev) => [newBlog, ...prev]);
      setShowForm(false);
      setTitle("");
      setCoverImg("");
      setContent("");
      setDateOverride("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-24">
      <h1 className="text-3xl font-bold mb-6 text-center">Blogs</h1>

      {canPost && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm((p) => !p)}
            className="px-4 py-2 bg-[#4B55C3] text-white rounded-lg hover:bg-[#5C53E5] transition"
          >
            {showForm ? "Cancel" : "Add Blog"}
          </button>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleAddBlog}
          className="mb-8 p-4 border rounded-lg shadow bg-white space-y-4"
        >
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Cover Image URL</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={coverImg}
              onChange={(e) => setCoverImg(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Content</label>
            <textarea
              className="w-full border rounded px-3 py-2 h-32"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Date (optional)</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={dateOverride}
              onChange={(e) => setDateOverride(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Publish
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {blogs.length === 0 ? (
  <p className="col-span-full text-center text-gray-600">No blogs yet.</p>
) : (
  blogs.map((blog) => {
    const manaviEmail = "manavisharma14@gmail.com";
    const manavEmail = "manavsharma1280@gmail.com";

    let authorName = blog.authorName;
    let authorImage = blog.authorImage;

    if (blog.authorEmail === manaviEmail) {
      authorName = "Manavi Sharma";
      authorImage = "../../../public/assets/manavi.png" // 👈 replace with actual Manavi image path
    } else if (blog.authorEmail === manavEmail) {
      authorName = "Shrishti";
      authorImage = "../../../public/assets/shrishti.jpeg"; // 👈 replace with actual Shrishti image path
    }


    return (
      <Link key={blog.id} href={`/blog/${blog.id}`}>
        <div className="border rounded-xl shadow hover:shadow-lg transition bg-white overflow-hidden p-4 cursor-pointer">
          {blog.coverImg && (
            <img
              src={blog.coverImg}
              alt={blog.title}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
          )}
          <h2 className="text-lg font-semibold">{blog.title}</h2>
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {blog.content}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <img
              src={authorImage}
              alt={authorName}
              className="w-6 h-6 rounded-full"
            />
            <p className="text-xs text-gray-500">
              {authorName} • {new Date(blog.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Link>
    );
  })
)}
      </div>
    </div>
  );
}