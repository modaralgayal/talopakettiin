import React from "react";
import { useNavigate } from "react-router-dom";
import { mockBlogs } from "../mockData/mockBlogs";
import Seo from "../seo/Seo";
import { useTranslation } from "react-i18next";

const Blogs = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCardClick = (id) => {
    navigate(`/blog/${id}`);
  };

  // JSON-LD structured data for Blog listing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Talopakettiin Blog",
    "description": "Articles about house packages, home building, and related topics",
    "url": "https://talopakettiin.fi/blog",
    "blogPost": mockBlogs.map(blog => ({
      "@type": "BlogPosting",
      "headline": blog.title,
      "datePublished": blog.date,
      "author": {
        "@type": "Person",
        "name": blog.author
      },
      "image": blog.imageUrl,
      "description": blog.summary
    }))
  };

  return (
    <>
      <Seo
        title="Blog - Talopakettiin"
        description="Read our latest articles about house packages, home building, and related topics."
        canonical="https://talopakettiin.fi/blog"
        schemaMarkup={jsonLd}
      />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("navigation.blog")}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover insights, tips, and trends about house packages and home building
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockBlogs.map((blog) => (
              <article
                key={blog.id}
                onClick={() => handleCardClick(blog.id)}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer group"
              >
                <div className="relative aspect-w-16 aspect-h-9 overflow-hidden">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="mr-4">{blog.date}</span>
                    <span>By {blog.author}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.summary}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-800 transition-colors duration-300">
                    Read More
                    <svg
                      className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blogs;
