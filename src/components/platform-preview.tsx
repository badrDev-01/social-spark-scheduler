import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import type { Platform } from "@/lib/mock-data";
import { platformMeta } from "@/lib/mock-data";

interface Props {
  platform: Platform;
  caption: string;
  mediaUrl?: string;
  hashtags: string[];
}

export function PlatformPreview({ platform, caption, mediaUrl, hashtags }: Props) {
  const meta = platformMeta[platform];
  const fullCaption = `${caption} ${hashtags.map((h) => `#${h}`).join(" ")}`.trim();
  const over = fullCaption.length > meta.charLimit;

  if (platform === "instagram") {
    return (
      <div className="overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-2 p-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-accent to-primary" />
          <div className="text-sm font-semibold">yourbrand</div>
        </div>
        <div className="aspect-square w-full bg-muted">
          {mediaUrl ? <img src={mediaUrl} alt="" className="h-full w-full object-cover" /> : null}
        </div>
        <div className="flex items-center gap-3 p-3 text-foreground">
          <Heart className="h-6 w-6" />
          <MessageCircle className="h-6 w-6" />
          <Send className="h-6 w-6" />
          <Bookmark className="ml-auto h-6 w-6" />
        </div>
        <div className="px-3 pb-3 text-sm">
          <span className="font-semibold">yourbrand </span>
          <span className="text-foreground/90">{fullCaption || "Your caption will appear here…"}</span>
        </div>
        <Meter len={fullCaption.length} limit={meta.charLimit} over={over} label="Feed · 1:1 aspect" />
      </div>
    );
  }

  if (platform === "tiktok") {
    return (
      <div className="overflow-hidden rounded-xl border bg-neutral-900 text-white shadow-[var(--shadow-soft)]">
        <div className="relative aspect-[9/16] w-full bg-black">
          {mediaUrl && <img src={mediaUrl} alt="" className="h-full w-full object-cover opacity-90" />}
          <div className="absolute inset-x-0 bottom-0 p-3 text-sm">
            <div className="font-semibold">@yourbrand</div>
            <p className="line-clamp-3">{fullCaption || "Caption…"}</p>
          </div>
        </div>
        <Meter len={fullCaption.length} limit={meta.charLimit} over={over} label="TikTok · 9:16 vertical" />
      </div>
    );
  }

  if (platform === "pinterest") {
    return (
      <div className="overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-soft)]">
        <div className="aspect-[2/3] w-full bg-muted">
          {mediaUrl && <img src={mediaUrl} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="p-3">
          <div className="line-clamp-2 text-sm font-semibold">{caption || "Pin title"}</div>
          <div className="mt-2 text-xs text-muted-foreground">Saved by yourbrand</div>
        </div>
        <Meter len={fullCaption.length} limit={meta.charLimit} over={over} label="Pin · 2:3 recommended" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex gap-3">
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/20" />
        <div className="flex-1">
          <div className="text-sm">
            <span className="font-semibold">Your Brand</span>
            <span className="ml-1 text-muted-foreground">@yourbrand</span>
          </div>
          <p className="mt-1 text-sm">{fullCaption || "Your post…"}</p>
          {mediaUrl && (
            <img src={mediaUrl} alt="" className="mt-3 aspect-video w-full rounded-xl object-cover" />
          )}
        </div>
      </div>
      <Meter len={fullCaption.length} limit={meta.charLimit} over={over} label={`${meta.label} preview`} />
    </div>
  );
}

function Meter({ len, limit, over, label }: { len: number; limit: number; over: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between border-t bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
      <span>{label}</span>
      <span className={over ? "font-medium text-destructive" : ""}>
        {len} / {limit}
      </span>
    </div>
  );
}
