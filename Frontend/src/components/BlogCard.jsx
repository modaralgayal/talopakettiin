import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/blog/${id}`);
  };

  const formattedDate = format(new Date(blog.date), "MMMM d, yyyy");

  return (
    <article
      onClick={() => handleCardClick(blog.id)}
      className="h-full cursor-pointer"
    >
      <div className="relative aspect-w-16 aspect-h-9 overflow-hidden">
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-white/70 mb-3">
          <span className="mr-4">{formattedDate}</span>
          <span>By {blog.author}</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
          {blog.title}
        </h2>
        <p className="text-white/80 mb-4 line-clamp-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
          {blog.summary}
        </p>
        <div className="flex items-center text-blue-300 font-medium group-hover:text-blue-200 transition-colors duration-300">
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
  );
};

export default BlogCard; 