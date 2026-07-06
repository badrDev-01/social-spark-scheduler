export type Platform = "instagram" | "tiktok" | "pinterest" | "twitter" | "linkedin";
export type PostStatus = "scheduled" | "published" | "draft" | "failed";

export interface Post {
  id: string;
  caption: string;
  platforms: Platform[];
  status: PostStatus;
  scheduledAt: string; // ISO
  mediaUrl?: string;
  mediaType?: "image" | "video";
  hashtags: string[];
  location?: string;
  engagement?: { likes: number; comments: number; shares: number };
}

export const platformMeta: Record<Platform, { label: string; color: string; charLimit: number }> = {
  instagram: { label: "Instagram", color: "oklch(0.65 0.2 15)", charLimit: 2200 },
  tiktok: { label: "TikTok", color: "oklch(0.3 0.03 240)", charLimit: 2200 },
  pinterest: { label: "Pinterest", color: "oklch(0.55 0.22 20)", charLimit: 500 },
  twitter: { label: "X / Twitter", color: "oklch(0.4 0.05 240)", charLimit: 280 },
  linkedin: { label: "LinkedIn", color: "oklch(0.45 0.13 240)", charLimit: 3000 },
};

const captions = [
  "Sunset over the studio — new drop launches Friday ✨",
  "Behind the scenes of this week's shoot. Which frame is your favorite?",
  "3 tips to level up your content strategy this quarter →",
  "Weekend vibes only 🌿 tag someone who needs this today",
  "Just added: fresh restock of our bestsellers. Link in bio.",
  "Ask me anything — dropping the Q&A in stories tomorrow",
  "Meet the team: chatting with our lead designer about the process",
  "Case study incoming: how we grew reach 3x in 60 days",
];

const tags = [
  ["contentmarketing", "socialmedia", "creator"],
  ["bts", "studio", "process"],
  ["strategy", "growth", "tips"],
  ["lifestyle", "weekend", "inspo"],
  ["launch", "newdrop", "shop"],
];

function daysFromNow(d: number, h = 10, m = 0) {
  const date = new Date();
  date.setDate(date.getDate() + d);
  date.setHours(h, m, 0, 0);
  return date.toISOString();
}

const platformSets: Platform[][] = [
  ["instagram"],
  ["instagram", "tiktok"],
  ["pinterest"],
  ["twitter", "linkedin"],
  ["instagram", "pinterest"],
  ["tiktok"],
];

const statuses: PostStatus[] = ["scheduled", "scheduled", "published", "draft", "scheduled", "published"];

export const mockPosts: Post[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `post-${i + 1}`,
  caption: captions[i % captions.length],
  platforms: platformSets[i % platformSets.length],
  status: statuses[i % statuses.length],
  scheduledAt: daysFromNow(i - 4, 8 + (i % 10), (i * 15) % 60),
  mediaUrl: `https://images.unsplash.com/photo-${
    ["1523275335684-37898b6baf30", "1519389950473-47ba0277781c", "1517841905240-472988babdf9", "1494790108377-be9c29b29330", "1500648767791-00dcc994a43e", "1529626455594-4ff0802cfb7e"][i % 6]
  }?w=800&auto=format&fit=crop`,
  mediaType: "image",
  hashtags: tags[i % tags.length],
  location: i % 3 === 0 ? "Brooklyn, NY" : undefined,
  engagement: {
    likes: Math.floor(200 + Math.random() * 5000),
    comments: Math.floor(10 + Math.random() * 400),
    shares: Math.floor(5 + Math.random() * 200),
  },
}));

export const analyticsSeries = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    impressions: Math.floor(3000 + Math.random() * 8000 + i * 120),
    engagement: Math.floor(200 + Math.random() * 700 + i * 8),
    reach: Math.floor(2000 + Math.random() * 5000 + i * 80),
  };
});

export const platformBreakdown = [
  { platform: "Instagram", posts: 42, engagement: 8200 },
  { platform: "TikTok", posts: 28, engagement: 12400 },
  { platform: "Pinterest", posts: 19, engagement: 3100 },
  { platform: "X", posts: 34, engagement: 4600 },
  { platform: "LinkedIn", posts: 12, engagement: 2800 },
];

export const contentTypes = [
  { name: "Photo", value: 48 },
  { name: "Video", value: 32 },
  { name: "Carousel", value: 15 },
  { name: "Story", value: 5 },
];
