// app/blog/page.tsx
import BlogsClient from "./BlogsClient";
import { getAllBlogs } from "@/lib/blogs";

export const revalidate = 60; // ISR every 60s

export default async function BlogPage() {
  const blogs = await getAllBlogs(); // ✅ direct DB call during build time
  return <BlogsClient initialBlogs={blogs} />;
}