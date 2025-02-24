import Link from "next/link";
interface FooterLink {
  label: string;
  href: string;
}
interface FooterSectionProps {
  title: string;
  links: FooterLink[];
}

const FooterSection = ({ title, links }: FooterSectionProps) => (
  <div>
    <h3 className="text-white font-semibold mb-4">{title}</h3>
    <ul className="space-y-3">
      {links.map((link, index) => (
        <li key={index}>
          <Link
            href={link.href}
            className="text-gray-400 hover:text-[#EB5017] transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default FooterSection;
