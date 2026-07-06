import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyticsSeries, platformBreakdown, contentTypes } from "@/lib/mock-data";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Postloop" },
      { name: "description", content: "Engagement, reach and content performance across your social channels." },
    ],
  }),
  component: AnalyticsPage,
});

const CHART_COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

const kpis = [
  { label: "Impressions", value: "184.2K", change: "+18.4%" },
  { label: "Engagement rate", value: "4.82%", change: "+0.6pt" },
  { label: "Followers gained", value: "+2,148", change: "+22%" },
  { label: "Avg. reach / post", value: "6,240", change: "+11%" },
];

function AnalyticsPage() {
  const exportCsv = () => {
    const rows = ["date,impressions,engagement,reach", ...analyticsSeries.map((r) => `${r.date},${r.impressions},${r.engagement},${r.reach}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "analytics.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">Track how your content performs across platforms.</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="h-9 w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All platforms</SelectItem>
              <SelectItem value="ig">Instagram</SelectItem>
              <SelectItem value="tt">TikTok</SelectItem>
              <SelectItem value="pin">Pinterest</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCsv} className="gap-1.5"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="shadow-[var(--shadow-soft)]">
            <CardContent className="p-4">
              <div className="text-xs font-medium text-muted-foreground">{k.label}</div>
              <div className="mt-2 flex items-baseline gap-2">
                <div className="text-2xl font-semibold tracking-tight">{k.value}</div>
                <div className="text-xs text-success">{k.change}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-[var(--shadow-soft)] lg:col-span-2">
          <CardContent className="p-5">
            <h2 className="mb-3 text-sm font-semibold">Impressions & engagement</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={analyticsSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" width={40} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="impressions" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="engagement" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardContent className="p-5">
            <h2 className="mb-3 text-sm font-semibold">Content type</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={contentTypes} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {contentTypes.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-soft)] lg:col-span-3">
          <CardContent className="p-5">
            <h2 className="mb-3 text-sm font-semibold">Platform breakdown</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={platformBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="platform" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" width={40} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="posts" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="engagement" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
