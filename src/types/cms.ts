// ─── CMS Pages ──────────────────────────────────────────

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Announcements ──────────────────────────────────────

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}
