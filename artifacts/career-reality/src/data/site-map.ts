export type SiteMapItem = {
  label: string;
  href: string;
  description?: string;
};

export type SiteMapSection = {
  label: string;
  items: SiteMapItem[];
};

export const siteMap: SiteMapSection[] = [
  {
    label: "Decide",
    items: [
      { label: "CareerReality Compass", href: "/compass", description: "Work through one high-stakes decision with live context." },
      { label: "Private workspace", href: "/workspace", description: "Keep saved decisions and company watchlists in one place." },
      { label: "Career Reality Pro", href: "/pro", description: "Go deeper when the headline is not enough." },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "CTC decoder", href: "/salary-calculator", description: "Translate an offer into usable monthly cash." },
      { label: "Salary reality", href: "/salary-reality", description: "See the range behind a role, city, and experience band." },
      { label: "Resignation risk", href: "/resignation-risk", description: "Name the runway, friction, and uncertainty around a move." },
      { label: "Layoff radar", href: "/layoff-radar", description: "Track public signals before they become a headline." },
      { label: "Salary drop", href: "/salary-drop", description: "Understand the trade-off behind a lower-paying move." },
      { label: "Escape plan", href: "/escape-plan", description: "Turn a difficult work situation into a sequence of next steps." },
      { label: "Career Reality Index", href: "/career-reality-index", description: "See the methodology behind the signal." },
      { label: "AI pulse", href: "/ai", description: "Separate useful work-shift signal from career panic." },
    ],
  },
  {
    label: "Editorial",
    items: [
      { label: "The journal", href: "/articles", description: "Sharp, useful writing for consequential work decisions." },
      { label: "Topic clusters", href: "/topic-clusters", description: "Follow a question instead of an algorithm." },
      { label: "Search the desk", href: "/search", description: "Find the useful signal across tools and reads." },
      { label: "Company intelligence", href: "/companies", description: "Read the company behind the offer." },
    ],
  },
  {
    label: "Trust",
    items: [
      { label: "About the desk", href: "/about" },
      { label: "Editorial standards", href: "/editorial" },
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
      { label: "Contact", href: "/contact" },
    ],
  },
];