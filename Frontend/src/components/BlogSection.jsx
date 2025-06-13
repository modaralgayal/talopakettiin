import React from 'react';
import { mockBlogs } from '../mockData/mockBlogs';
import BlogCard from './BlogCard';
import { useTranslation } from "react-i18next";

const BlogSection = () => {
  const { t } = useTranslation();

  // Sort posts by date (newest first) and limit to 6
  const sortedAndLimitedPosts = [...mockBlogs]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glassmorphic banner for the title */}
        <div className="bg-white/10 backdrop-blur-lg py-6 mb-12 rounded-2xl shadow-lg border border-white/20">
          <h2 className="text-3xl font-bold text-center text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            {t("homepage.blog.title")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedAndLimitedPosts.map((blog) => (
            <div
              key={blog.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-white/15 overflow-hidden group"
            >
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection; 