import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockBlogs } from "../mockData/mockBlogs";
import Seo from "../seo/Seo";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

const Blog = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Convert id to number, since mockBlogs uses numeric IDs
  const blogId = parseInt(id, 10);
  const blog = mockBlogs.find((item) => item.id === blogId);

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
          <button
            onClick={() => navigate("/blog")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  // JSON-LD structured data for Blog post
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "datePublished": blog.date,
    "author": {
      "@type": "Person",
      "name": blog.author
    },
    "image": blog.imageUrl,
    "description": blog.summary,
    "articleBody": blog.content
  };

  // Format the date
  const formattedDate = format(new Date(blog.date), "MMMM d, yyyy");

  return (
    <>
      <Seo
        title={`${blog.title} - Talopakettiin Blog`}
        description={blog.summary}
        canonical={`https://talopakettiin.fi/blog/${blog.id}`}
        image={blog.imageUrl}
        schemaMarkup={jsonLd}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[500px] w-full">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center justify-center text-white/90 space-x-4">
                <span>By {blog.author}</span>
                <span>•</span>
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {blog.content.split('\n\n').map((paragraph, index) => {
                // Check if paragraph is a heading
                if (paragraph.startsWith('##')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                      {paragraph.replace('##', '').trim()}
                    </h2>
                  );
                }
                // Check if paragraph is a list item
                if (paragraph.startsWith('1.') || paragraph.startsWith('-')) {
                  return (
                    <ul key={index} className="list-disc pl-6 mb-4 space-y-2">
                      {paragraph.split('\n').map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700">
                          {item.replace(/^[0-9]+\.\s*|^-\s*/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                // Regular paragraph
                return (
                  <p key={index} className="text-gray-700 mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Back to Blog Button */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <button
                onClick={() => navigate("/blog")}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group"
              >
                <svg
                  className="mr-2 w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Blog
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
