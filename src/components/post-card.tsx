import { Instagram, Music2, Image as ImageIcon, Twitter, Linkedin, MoreHorizontal, Clock, MapPin, Copy, Pencil, X } from "lucide-react";
import type { Post, Platform } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const platformIcon: Record<Platform, typeof Instagram> = {
  instagram: Instagram,
  tiktok: Music2,
  pinterest: ImageIcon,
  twitter: Twitter,
  linkedin: Linkedin,
};

const statusStyle: Record<Post["status"], string> = {
  scheduled: "bg-primary/10 text-primary border-primary/20",
  published: "bg-success/15 text-success border-success/25",
  draft: "bg-muted text-muted-foreground border-border",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

export function PostCard({ post }: { post: Post }) {
  const date = new Date(post.scheduledAt);
  return (
    <div className="group flex gap-3 rounded-xl border bg-card p-3 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-elevated)]">
      {post.mediaUrl && (
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted sm:h-24 sm:w-24">
          <img src={post.mediaUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className={cn("h-5 px-1.5 text-[10px] font-medium capitalize", statusStyle[post.status])}>
              {post.status}
            </Badge>
            <div className="flex items-center gap-1">
              {post.platforms.map((p) => {
                const Icon = platformIcon[p];
                return (
                  <div key={p} className="grid h-5 w-5 place-items-center rounded-full bg-secondary" title={p}>
                    <Icon className="h-3 w-3" />
                  </div>
                );
              })}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Post actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
              <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive"><X className="mr-2 h-4 w-4" /> Cancel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm text-foreground">{post.caption}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {date.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
          </span>
          {post.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {post.location}
            </span>
          )}
          {post.engagement && post.status === "published" && (
            <span>♥ {post.engagement.likes.toLocaleString()} · 💬 {post.engagement.comments}</span>
          )}
        </div>
      </div>
    </div>
  );
}
