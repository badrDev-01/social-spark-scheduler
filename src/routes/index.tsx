import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TrendingUp, Calendar as CalendarIcon, CheckCircle2, Users, Plus, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/post-card";
import { mockPosts, analyticsSeries } from "@/lib/mock-data";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Postloop" },
      { name: "description", content: "Overview of your scheduled and published social media posts." },
    ],
  }),
  component: Dashboard,
});

const kpis = [
  { label: "Total Posts", value: "248", change: "+12%", icon: CalendarIcon, tone: "text-primary" },
  { label: "Published this month", value: "62", change: "+8%", icon: CheckCircle2, tone: "text-success" },
  { label: "Engagement rate", value: "4.8%", change: "+0.6pt", icon: TrendingUp, tone: "text-accent" },
  { label: "Avg. reach", value: "18.4K", change: "+21%", icon: Users, tone: "text-primary" },
];

function Dashboard() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => mockPosts.filter((p) => p.caption.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good morning, Alex</h1>
          <p className="text-sm text-muted-foreground">Here's what's happening across your channels today.</p>
        </div>
        <Button asChild style={{ background: "var(--gradient-accent)" }} className="gap-1.5">
          <Link to="/schedule"><Plus className="h-4 w-4" /> New Post</Link>
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="shadow-[var(--shadow-soft)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{k.label}</span>
                <k.icon className={`h-4 w-4 ${k.tone}`} />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <div className="text-2xl font-semibold tracking-tight">{k.value}</div>
                <div className="text-xs text-success">{k.change}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend chart */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Engagement — last 30 days</h2>
              <p className="text-xs text-muted-foreground">Impressions and reach across all platforms</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <AreaChart data={analyticsSeries}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                <Area type="monotone" dataKey="impressions" stroke="var(--color-primary)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="reach" stroke="var(--color-accent)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Posts list */}
      <Card className="shadow-[var(--shadow-soft)]">
        <CardContent className="p-5">
          <Tabs defaultValue="upcoming">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Input
                  placeholder="Search posts"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-9 w-full sm:w-56"
                />
                <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-4 w-4" />Filter</Button>
              </div>
            </div>
            <TabsContent value="upcoming" className="mt-4 grid gap-3 md:grid-cols-2">
              {filtered.filter((p) => p.status === "scheduled").map((p) => <PostCard key={p.id} post={p} />)}
            </TabsContent>
            <TabsContent value="published" className="mt-4 grid gap-3 md:grid-cols-2">
              {filtered.filter((p) => p.status === "published").map((p) => <PostCard key={p.id} post={p} />)}
            </TabsContent>
            <TabsContent value="drafts" className="mt-4 grid gap-3 md:grid-cols-2">
              {filtered.filter((p) => p.status === "draft").map((p) => <PostCard key={p.id} post={p} />)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
