// serviceTypes.ts

// Service options for different categories
const haircutsAndStyling = [
  { label: "Skin Fade Taper Fade", value: "Skin Fade Taper Fade" },
  { label: "Buzz Cut", value: "Buzz Cut" },
  { label: "Crew Cut", value: "Crew Cut" },
  { label: "Scissor Cut", value: "Scissor Cut" },
  { label: "Razor Fade", value: "Razor Fade" },
  { label: "Undercut", value: "Undercut" },
  { label: "Pompadour", value: "Pompadour" },
  { label: "Textured Crop", value: "Textured Crop" },
  { label: "Comb Over", value: "Comb Over" },
  { label: "Afro Shape-up", value: "Afro Shape-up" },
  { label: "Hair Tattoo Designs", value: "Hair Tattoo Designs" },
];

const beardAndFacialGrooming = [
  { label: "Beard Trim & Shape-up", value: "Beard Trim & Shape-up" },
  { label: "Hot Towel Shave", value: "Hot Towel Shave" },
  { label: "Straight Razor Shave", value: "Straight Razor Shave" },
  { label: "Goatee Trim", value: "Goatee Trim" },
  { label: "Moustache Trim", value: "Moustache Trim" },
  { label: "Beard Line-up", value: "Beard Line-up" },
  { label: "Full Beard Styling", value: "Full Beard Styling" },
];

const hairAndBeardColoring = [
  { label: "Hair Dyeing Highlights", value: "Hair Dyeing Highlights" },
  { label: "Beard Coloring", value: "Beard Coloring" },
  { label: "Grey Coverage", value: "Grey Coverage" },
  { label: "Semi Permanent Color", value: "Semi Permanent Color" },
  { label: "Hair Bleaching", value: "Hair Bleaching" },
];

const hairAndScalpTreatments = [
  { label: "Hair Wash & Conditioning", value: "Hair Wash & Conditioning" },
  { label: "Scalp Detox Treatment", value: "Scalp Detox Treatment" },
  { label: "Keratin Treatment", value: "Keratin Treatment" },
  { label: "Dandruff Treatment", value: "Dandruff Treatment" },
  { label: "Hair Relaxing Perm", value: "Hair Relaxing Perm" },
];

const facialAndSkinCare = [
  { label: "Eyebrow Shaping", value: "Eyebrow Shaping" },
  { label: "Nose & Ear Waxing", value: "Nose & Ear Waxing" },
  { label: "Facial Treatment", value: "Facial Treatment" },
  { label: "Black Mask Facial", value: "Black Mask Facial" },
  { label: "Charcoal Peel Off Mask", value: "Charcoal Peel Off Mask" },
];

// Define the custom unassigned option
export const customOption = { label: "Unassigned", value: "unassigned" };

// Service option interface
export interface ServiceOption {
  value: string;
  label: string;
}

// Grouped option interface
export interface GroupedServiceOption {
  label: string;
  options: ServiceOption[];
}

// Exportable service types array with all categories
export const serviceType: GroupedServiceOption[] = [
  {
    label: "Other",
    options: [customOption],
  },
  {
    label: "Haircuts & Styling",
    options: haircutsAndStyling,
  },
  {
    label: "Beard & Facial Grooming",
    options: beardAndFacialGrooming,
  },
  {
    label: "Hair & Beard Coloring",
    options: hairAndBeardColoring,
  },
  {
    label: "Hair & Scalp Treatments",
    options: hairAndScalpTreatments,
  },
  {
    label: "Facial & Skin Care",
    options: facialAndSkinCare,
  },
  {
    label: "Other",
    options: [customOption],
  },
];

// For backward compatibility with existing code
// export const flatServiceOptions: ServiceOption[] = [
//   ...haircutsAndStyling,
//   ...beardAndFacialGrooming,
//   ...hairAndBeardColoring,
//   ...hairAndScalpTreatments,
//   ...facialAndSkinCare,
//   customOption,
// ];
