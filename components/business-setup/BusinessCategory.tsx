import { useSetupBusinessMutation } from "@/store/features/businessApiSetupSlice";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import Button from "../UI/Button";
import Input from "../UI/Input";
import { useAppDispatch } from "@/store/hooks";
import { setCurrentStep } from "@/store/features/businessSetupSlice";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [setupBusiness, { isLoading }] = useSetupBusinessMutation();
  const dispatch = useAppDispatch();

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    if (category !== "Other") {
      setCustomCategory("");
      handleSaveCategory(category);
    }
  };

  const handleCustomCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomCategory(e.target.value);
  };

  const handleSaveCategory = (category: string) => {
    setupBusiness({ currentStep: 2, businessCategory: category })
      .unwrap()
      .then(() => {
        dispatch(setCurrentStep(3));
        redirect("location-option");
      });
  };

  const handleSubmit = () => {
    const category =
      selectedCategory === "Other" ? customCategory : selectedCategory;
    if (category) {
      handleSaveCategory(category);
    }
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
          <Input
            type="text"
            id="businessCategory"
            value={customCategory}
            onChange={handleCustomCategoryChange}
            placeholder="Please specify your category"
          />
        </div>
      )}
      <div className="mt-4">
        <Button
          el="button"
          primary
          loading={isLoading}
          rounded
          onClick={handleSubmit}
          disabled={!customCategory && selectedCategory === "Other"}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default BusinessCategory;
