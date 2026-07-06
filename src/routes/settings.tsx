import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Music2, Image as ImageIcon, Twitter, Linkedin, Check, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Postloop" },
      { name: "description", content: "Manage account, connected social profiles, team members and notifications." },
    ],
  }),
  component: SettingsPage,
});

const accounts = [
  { platform: "Instagram", handle: "@yourbrand", connected: true, icon: Instagram },
  { platform: "TikTok", handle: "@yourbrand", connected: true, icon: Music2 },
  { platform: "Pinterest", handle: "yourbrand", connected: false, icon: ImageIcon },
  { platform: "X / Twitter", handle: "@yourbrand", connected: true, icon: Twitter },
  { platform: "LinkedIn", handle: "Your Brand", connected: false, icon: Linkedin },
];

const team = [
  { name: "Alex Morgan", email: "alex@yourbrand.co", role: "Owner", initials: "AM" },
  { name: "Priya Shah", email: "priya@yourbrand.co", role: "Editor", initials: "PS" },
  { name: "Jonas Weber", email: "jonas@yourbrand.co", role: "Viewer", initials: "JW" },
];

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account, integrations and team.</p>
      </div>

      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-4">
          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="space-y-5 p-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16"><AvatarFallback className="bg-primary text-primary-foreground">AM</AvatarFallback></Avatar>
                <div>
                  <div className="font-medium">Alex Morgan</div>
                  <div className="text-sm text-muted-foreground">alex@yourbrand.co</div>
                  <Button variant="outline" size="sm" className="mt-2">Change photo</Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="fn">Full name</Label><Input id="fn" defaultValue="Alex Morgan" className="mt-1.5" /></div>
                <div><Label htmlFor="em">Email</Label><Input id="em" defaultValue="alex@yourbrand.co" className="mt-1.5" /></div>
                <div><Label htmlFor="co">Company</Label><Input id="co" defaultValue="Your Brand Co." className="mt-1.5" /></div>
                <div><Label htmlFor="ph">Timezone</Label><Input id="ph" defaultValue="America/New_York" className="mt-1.5" /></div>
              </div>
              <div className="flex justify-end"><Button onClick={() => toast.success("Profile saved")}>Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections" className="mt-4">
          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="divide-y p-0">
              {accounts.map((a) => (
                <div key={a.platform} className="flex items-center gap-4 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{a.platform}</div>
                    <div className="text-xs text-muted-foreground">{a.handle}</div>
                  </div>
                  {a.connected ? (
                    <>
                      <Badge className="bg-success/15 text-success"><Check className="mr-1 h-3 w-3" />Connected</Badge>
                      <Button variant="ghost" size="sm">Disconnect</Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => toast.info("OAuth flow placeholder — connect real credentials in settings")}>
                      Connect
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="p-5">
              <div className="mb-4 flex flex-wrap gap-2">
                <Input placeholder="teammate@company.com" className="max-w-xs" />
                <Button className="gap-1.5" onClick={() => toast.success("Invitation sent")}><Plus className="h-4 w-4" />Invite</Button>
              </div>
              <div className="divide-y rounded-lg border">
                {team.map((m) => (
                  <div key={m.email} className="flex items-center gap-3 p-3">
                    <Avatar className="h-9 w-9"><AvatarFallback>{m.initials}</AvatarFallback></Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.email}</div>
                    </div>
                    <Badge variant="outline">{m.role}</Badge>
                    {m.role !== "Owner" && (
                      <Button variant="ghost" size="icon" aria-label="Remove"><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="divide-y p-0">
              {[
                { title: "Post published", desc: "When a scheduled post goes live", d: true },
                { title: "Post failed", desc: "Delivery failure or platform error", d: true },
                { title: "Weekly analytics digest", desc: "Every Monday at 9am", d: true },
                { title: "New comments", desc: "Someone comments on a published post", d: false },
                { title: "Team activity", desc: "Members create or edit posts", d: false },
              ].map((n) => (
                <div key={n.title} className="flex items-center justify-between p-4">
                  <div>
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs text-muted-foreground">{n.desc}</div>
                  </div>
                  <Switch defaultChecked={n.d} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
