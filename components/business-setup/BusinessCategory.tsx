import React, { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

const businessCategories = [
  "Barber",
  "Beauty Salon",
  "Hair Salon",
  "Nail Salon",
  "Spa",
  "Tattoo Parlor",
  "Massage Therapist",
  "Photographer",
  "Makeup Artist",
  "Catering",
  "Event Planner",

  "Other",
];

const BusinessCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState<string>("");

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    if (category !== "Other") {
      setCustomCategory("");
    }
  };

  const handleCustomCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomCategory(e.target.value);
  };

  const handleSubmit = () => {
    const finalCategory =
      selectedCategory === "Other" ? customCategory : selectedCategory;
    console.log("Selected Category:", finalCategory);
  };

  return (
    <div>
      <div className="flex flex-col items-start ">
        {businessCategories.map((category) => (
          <button
            className="flex w-full items-center text-body justify-between border-b-2 border-[#F5F7FA] py-6 hover:bg-gray-100"
            key={category}
            onClick={() => handleSelectCategory(category)}
          >
            <span>{category}</span>
            <MdKeyboardArrowRight color="#717171" size={20} />
          </button>
        ))}
      </div>

      {selectedCategory === "Other" && (
        <div>
          <input
            type="text"
            value={customCategory}
            onChange={handleCustomCategoryChange}
            placeholder="Please specify your category"
            style={{ marginTop: "10px", padding: "5px", width: "100%" }}
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!customCategory && selectedCategory === "Other"}
      >
        Submit
      </button>

      {selectedCategory && (
        <p>
          Selected Category:{" "}
          {selectedCategory === "Other" ? customCategory : selectedCategory}
        </p>
      )}
    </div>
  );
};

export default BusinessCategory;
