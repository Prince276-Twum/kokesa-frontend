interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinks {
  about: FooterLink[];
  business: FooterLink[];
  legal: FooterLink[];
  social: FooterLink[];
}

export const footerLinks: FooterLinks = {
  about: [
    { label: "Customer Support", href: "/support" },
    { label: "Our Team", href: "/team" },
  ],
  business: [
    { label: "List your business", href: "/list-business" },
    { label: "Pricing", href: "/pricing" },
    { label: "Support", href: "/support" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of service", href: "/terms" },
    { label: "Terms Policy", href: "/terms-policy" },
  ],
  social: [
    { label: "Instagram", href: "/instagram" },
    { label: "Facebook", href: "/facebook" },
    { label: "X (Twitter)", href: "/twitter" },
  ],
};

interface StatCardProps {
  number: string;
  label: string;
}

export const stats: StatCardProps[] = [
  { number: "100,000+", label: "Appointments booked on Kokesa" },
  { number: "1,000+", label: "Partner Businesses" },
  { number: "100+", label: "Countries" },
  { number: "50,000+", label: "Stylists & Professionals" },
];







interface BreakTime {
  start: string;
  end: string;
}

type WorkingHoursType = {
  day_of_week:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  enabled: boolean;
  start_time: string; // Format: "HH:mm"
  end_time: string; // Format: "HH:mm"
  breaks: BreakTime[];
}[];


export const WORKINGDAYS : WorkingHoursType = [
  {
    day_of_week: "Monday",
    enabled: true,
    start_time: "09:20",
    end_time: "17:40",
    breaks: [],
  },
  {
    day_of_week: "Tuesday",
    enabled: true,
    start_time: "09:00",
    end_time: "17:00",
    breaks: [],
  },
  {
    day_of_week: "Wednesday",
    enabled: true,
    start_time: "09:00",
    end_time: "17:00",
    breaks: [],
  },
  {
    day_of_week: "Thursday",
    enabled: true,
    start_time: "09:00",
    end_time: "17:00",
    breaks: [],
  },
  {
    day_of_week: "Friday",
    enabled: true,
    start_time: "09:00",
    end_time: "17:00",
    breaks: [],
  },
  {
    day_of_week: "Saturday",
    enabled: true,
    start_time: "09:00",
    end_time: "17:00",
    breaks: [],
  },
  {
    day_of_week: "Sunday",
    enabled: false,
    start_time: "09:00",
    end_time: "17:00",
    breaks: [],
  },
]