import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarIcon, ImagePlus, MapPin, Link2, Hash, Save, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlatformPreview } from "@/components/platform-preview";
import { platformMeta, type Platform } from "@/lib/mock-data";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule a Post — Postloop" },
      { name: "description", content: "Compose, preview and schedule posts across social platforms." },
    ],
  }),
  component: SchedulePage,
});

const ALL_PLATFORMS: Platform[] = ["instagram", "tiktok", "pinterest", "twitter", "linkedin"];

function SchedulePage() {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("contentcreator socialmedia");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>(["instagram", "tiktok"]);
  const [previewOn, setPreviewOn] = useState<Platform>("instagram");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [tz, setTz] = useState("America/New_York");
  const [recurring, setRecurring] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop",
  );

  const togglePlatform = (p: Platform) => {
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const onFile = (f?: File) => {
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) return toast.error("File too large (max 20MB)");
    setMediaUrl(URL.createObjectURL(f));
  };

  const submit = (draft = false) => {
    if (!draft && !caption.trim()) return toast.error("Caption is required");
    if (!draft && platforms.length === 0) return toast.error("Select at least one platform");
    toast.success(draft ? "Saved as draft" : `Scheduled for ${new Date(date).toLocaleString()}`);
  };

  const hashArr = hashtags.split(/\s+/).filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Schedule a post</h1>
        <p className="text-sm text-muted-foreground">Compose once, publish everywhere.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* Form */}
        <Card className="shadow-[var(--shadow-soft)]">
          <CardContent className="space-y-5 p-5">
            {/* Media */}
            <div>
              <Label className="mb-2 block">Media</Label>
              <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 text-center transition hover:border-primary hover:bg-primary/5">
                {mediaUrl ? (
                  <img src={mediaUrl} alt="preview" className="max-h-56 rounded-lg object-cover" />
                ) : (
                  <>
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    <div className="text-sm font-medium">Drop an image or video</div>
                    <div className="text-xs text-muted-foreground">PNG, JPG, MP4 up to 20MB</div>
                  </>
                )}
                <input type="file" accept="image/*,video/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
            </div>

            {/* Platforms */}
            <div>
              <Label className="mb-2 block">Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {ALL_PLATFORMS.map((p) => {
                  const active = platforms.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-secondary-foreground hover:bg-secondary/70"
                      }`}
                    >
                      {platformMeta[p].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Caption */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label htmlFor="caption">Caption</Label>
                <span className={`text-xs ${caption.length > 2200 ? "text-destructive" : "text-muted-foreground"}`}>
                  {caption.length} chars
                </span>
              </div>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write something engaging…"
                rows={5}
                className="resize-none"
              />
            </div>

            {/* Meta row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="tags" className="mb-2 flex items-center gap-1.5"><Hash className="h-3.5 w-3.5" /> Hashtags</Label>
                <Input id="tags" value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="growth strategy" />
              </div>
              <div>
                <Label htmlFor="loc" className="mb-2 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Location</Label>
                <Input id="loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Brooklyn, NY" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="link" className="mb-2 flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5" /> Link / CTA</Label>
                <Input id="link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://your.link" />
              </div>
            </div>

            {/* Schedule */}
            <div className="rounded-xl border bg-secondary/30 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <CalendarIcon className="h-4 w-4" /> Scheduling
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="dt" className="mb-1.5 block text-xs">Date & time</Label>
                  <Input id="dt" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="tz" className="mb-1.5 block text-xs">Timezone</Label>
                  <Select value={tz} onValueChange={setTz}>
                    <SelectTrigger id="tz"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern (New York)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific (Los Angeles)</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-background/60 px-3 py-2">
                <div>
                  <div className="text-sm font-medium">Repeat</div>
                  <div className="text-xs text-muted-foreground">Weekly at the same time</div>
                </div>
                <Switch checked={recurring} onCheckedChange={setRecurring} />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={() => submit(true)}><Save className="mr-1.5 h-4 w-4" />Save draft</Button>
              <Button onClick={() => submit(false)} style={{ background: "var(--gradient-accent)" }}>
                <Send className="mr-1.5 h-4 w-4" />Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="p-4">
              <Tabs value={previewOn} onValueChange={(v) => setPreviewOn(v as Platform)}>
                <TabsList className="w-full">
                  {(platforms.length ? platforms : ALL_PLATFORMS.slice(0, 3)).map((p) => (
                    <TabsTrigger key={p} value={p} className="flex-1 text-xs capitalize">{p}</TabsTrigger>
                  ))}
                </TabsList>
                {ALL_PLATFORMS.map((p) => (
                  <TabsContent key={p} value={p} className="mt-4">
                    <PlatformPreview platform={p} caption={caption} mediaUrl={mediaUrl} hashtags={hashArr} />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
