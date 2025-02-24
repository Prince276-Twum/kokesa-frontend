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
