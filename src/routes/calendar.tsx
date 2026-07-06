import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockPosts, platformMeta, type Post } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Postloop" },
      { name: "description", content: "Month view of your scheduled posts across every platform." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const { days, monthLabel } = useMemo(() => {
    const start = new Date(cursor);
    start.setDate(1);
    const startWeekday = start.getDay();
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(null);
    return {
      days: cells,
      monthLabel: cursor.toLocaleString("en-US", { month: "long", year: "numeric" }),
    };
  }, [cursor]);

  const postsByDay = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const p of mockPosts) {
      const d = new Date(p.scheduledAt);
      const key = d.toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return map;
  }, []);

  const shift = (n: number) => {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() + n);
    setCursor(d);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground">Drag-and-drop is coming soon — click a post to edit.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => shift(-1)} aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></Button>
          <div className="min-w-40 text-center text-sm font-medium">{monthLabel}</div>
          <Button variant="outline" size="icon" onClick={() => shift(1)} aria-label="Next month"><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => { const n = new Date(); n.setDate(1); setCursor(n); }}>Today</Button>
        </div>
      </div>

      <Card className="shadow-[var(--shadow-soft)]">
        <CardContent className="p-3 sm:p-5">
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const posts = day ? postsByDay.get(day.toDateString()) ?? [] : [];
              const isToday = day && day.toDateString() === new Date().toDateString();
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-24 rounded-lg border bg-card p-1.5 sm:min-h-28",
                    !day && "invisible",
                    isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                  )}
                >
                  {day && (
                    <>
                      <div className={cn("mb-1 text-right text-xs", isToday ? "font-semibold text-primary" : "text-muted-foreground")}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {posts.slice(0, 3).map((p) => (
                          <div
                            key={p.id}
                            className="truncate rounded px-1.5 py-1 text-[10px] font-medium text-white shadow-sm"
                            style={{ background: platformMeta[p.platforms[0]].color }}
                            title={p.caption}
                          >
                            {new Date(p.scheduledAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} · {p.caption.slice(0, 20)}
                          </div>
                        ))}
                        {posts.length > 3 && (
                          <div className="text-[10px] text-muted-foreground">+{posts.length - 3} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(platformMeta).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: v.color }} />
            <span className="text-muted-foreground">{v.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
