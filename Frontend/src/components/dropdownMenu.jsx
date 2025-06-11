import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

// Dropdown menu component
export const DropdownMenu = ({ items, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`text-gray-700 hover:text-blue-600 text-lg font-medium transition-colors relative px-3 py-2 rounded-md flex items-center focus:outline-none ${
          isOpen ? "text-blue-600" : ""
        }`}
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {title}
        <svg
          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`absolute left-0 top-full min-w-full w-max rounded-b-lg rounded-t-none bg-white/40 backdrop-blur-lg transition-all duration-200 transform origin-top z-50 border-t border-white/30 ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{
          marginTop: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <div className="py-2">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `block px-6 py-3 text-base font-semibold rounded-md transition-colors text-gray-700 hover:bg-blue-50/60 hover:text-blue-700 focus:bg-blue-100/60 focus:text-blue-700 outline-none cursor-pointer ${
                  isActive ? "bg-blue-100/60 text-blue-700" : ""
                }`
              }
              tabIndex={0}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};
