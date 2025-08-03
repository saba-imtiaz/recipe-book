import React from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex justify-center items-center gap-1" // reduced gap
    >
      <div className="relative">
        {/* Search Icon inside input */}
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>

        {/* Input field with padding to accommodate icon */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search recipes..."
          className="w-150 pl-10 pr-4 py-2 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Search button - styled like 'Add Recipe' button */}
   <button
  type="submit"
  className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-6 py-3 rounded-md text-l font-semibold shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-0 border-none"
>
  Search
</button>

    </form>
  );
};

export default SearchBar;
