import { useEffect, useMemo, useRef, useState } from "react";
import { fetchRsvpList, updateAttendance, ATTENDANCE_OPTIONS, type RsvpRow } from "@/lib/rsvpApi";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type AttendanceFilter = "All" | "Going" | "Not Going" | "Maybe" | "No Response";

function formatRelative(isoLike?: string) {
  if (!isoLike) return "";
  const date = new Date(isoLike);
  if (isNaN(date.getTime())) return String(isoLike);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const diffMs = date.getTime() - Date.now();
  const diffMin = Math.round(diffMs / 60000);
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  const diffHr = Math.round(diffMin / 60);
  if (Math.abs(diffHr) < 24) return rtf.format(diffHr, "hour");
  const diffDay = Math.round(diffHr / 24);
  return rtf.format(diffDay, "day");
}

export default function Manage() {
  const [rows, setRows] = useState<RsvpRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilter>("All");
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Preserve scroll across refreshes
  useEffect(() => {
    const y = sessionStorage.getItem("manage.scrollY");
    if (y) window.scrollTo(0, Number(y));
    const onScroll = () => sessionStorage.setItem("manage.scrollY", String(window.scrollY));
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchRsvpList();
      setRows(data.rows);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load RSVP list");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQ = !q || r.Name.toLowerCase().includes(q) || (r.GroupName || "").toLowerCase().includes(q);
      const att = (r.Attendance || "").trim();
      const attLabel = att === "" ? "No Response" : att;
      const matchesA = attendanceFilter === "All" || attendanceFilter === attLabel;
      return matchesQ && matchesA;
    });
  }, [rows, search, attendanceFilter]);

  const groups = useMemo(() => {
    const map = new Map<string, RsvpRow[]>();
    for (const r of filtered) {
      const key = r.GroupId || r.ID;
      const arr = map.get(key) || [];
      arr.push(r);
      map.set(key, arr);
    }
    return Array.from(map.entries()).map(([groupId, members]) => ({ groupId, members }));
  }, [filtered]);

  const counts = useMemo(() => {
    const c = { All: rows.length, Going: 0, "Not Going": 0, Maybe: 0, "No Response": 0 } as Record<AttendanceFilter, number>;
    for (const r of rows) {
      const att = (r.Attendance || "").trim();
      if (!att) c["No Response"]++;
      else if (att === "Going") c["Going"]++;
      else if (att === "Not Going") c["Not Going"]++;
      else if (att === "Maybe") c["Maybe"]++;
    }
    return c;
  }, [rows]);

  async function handleChange(id: string, attendance: string) {
    try {
      await updateAttendance(id, attendance);
      // refresh but keep filters/scroll
      await load();
      toast.success("Updated attendance");
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    }
  }

  async function handleBulk(group: RsvpRow[], attendance: string) {
    try {
      for (const r of group) {
        await updateAttendance(r.ID, attendance);
      }
      await load();
      toast.success("Updated group attendance");
    } catch (err: any) {
      toast.error(err?.message || "Bulk update failed");
    }
  }

  return (
    <section className="py-10 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">RSVP Manager</h1>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Input placeholder="Search name or group..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />

          <Select value={attendanceFilter} onValueChange={(v) => setAttendanceFilter(v as AttendanceFilter)}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by attendance" /></SelectTrigger>
            <SelectContent>
              {(["All", "Going", "Not Going", "Maybe", "No Response"] as AttendanceFilter[]).map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>All: {counts["All"]}</span>
            <span>Going: {counts["Going"]}</span>
            <span>Not Going: {counts["Not Going"]}</span>
            <span>Maybe: {counts["Maybe"]}</span>
            <span>No Response: {counts["No Response"]}</span>
          </div>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div ref={containerRef} className="space-y-6">
            {groups.map(({ groupId, members }) => {
              const label = (members[0].GroupName && members[0].GroupName!.trim()) || members[0].Name;
              return (
                <Card key={groupId} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold">{label}</div>
                    <div className="flex items-center gap-2">
                      <Select onValueChange={(v) => handleBulk(members, v)}>
                        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Set group attendance" /></SelectTrigger>
                        <SelectContent>
                          {ATTENDANCE_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                          <SelectItem value="">No Response</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => load()}>Refresh</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground px-2">
                    <div className="col-span-5">Name</div>
                    <div className="col-span-3">Group</div>
                    <div className="col-span-2">Attendance</div>
                    <div className="col-span-2">Updated</div>
                  </div>
                  <Separator className="my-2" />

                  <div className="space-y-2">
                    {members.map((m) => (
                      <div key={m.ID} className="grid grid-cols-12 items-center gap-2 px-2">
                        <div className="col-span-5">{m.Name}</div>
                        <div className="col-span-3">{(m.GroupName && m.GroupName.trim()) || m.Name}</div>
                        <div className="col-span-2">
                          <Select value={(m.Attendance ?? "")} onValueChange={(v) => handleChange(m.ID, v)}>
                            <SelectTrigger><SelectValue placeholder="No Response" /></SelectTrigger>
                            <SelectContent>
                              {ATTENDANCE_OPTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                              <SelectItem value="">No Response</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2" title={m.UpdatedAt || ""}>{formatRelative(m.UpdatedAt)}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}


