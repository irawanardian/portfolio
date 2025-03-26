import { useRef } from "react";

const CategoryScroll = ({ categories, selected, onSelect }) => {
  const scrollRef = useRef(null);

  const handleWheel = (e) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="w-full">
      {" "}
      {/* Pastikan ini tidak menggunakan max-w dan mx-auto */}
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex flex-nowrap overflow-x-scroll gap-3 snap-x snap-mandatory scrollbar-hide pb-4 items-start justify-start"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className="text-white px-4 py-2 rounded-lg snap-start hover:text-gray-300 whitespace-nowrap"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScroll;
