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
        {/* White background banner for the title */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm py-4 mb-12 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-gray-900 tracking-tight">
            {t("homepage.blog.title")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedAndLimitedPosts.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection; 