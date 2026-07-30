export interface NavItem {
  href: string;
  label: string;
  icon?: string;
  highlight?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
