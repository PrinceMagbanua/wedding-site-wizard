import { Fragment, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, ArrowLeft, Loader2, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { toast } from "sonner";
import { fetchRsvpList, updateAttendance, type RsvpRow } from "@/lib/rsvpApi";

type Group = {
  groupId: string;
  groupName: string;
  members: { id: string; name: string; attendance?: string }[];
  rows: RsvpRow[];
};

const RSVPSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string[] | null>(null);
  const [selectedGroupRows, setSelectedGroupRows] = useState<RsvpRow[] | null>(null);
  const [rowLoading, setRowLoading] = useState<Record<string, boolean>>({});
  const [attemptHistory, setAttemptHistory] = useState<Record<string, number[]>>({});

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchRsvpList();
        // Group by GroupId
        const map = new Map<string, RsvpRow[]>();
        for (const r of data.rows) {
          const key = String(r.GroupId || r.ID);
          const arr = map.get(key) || [];
          arr.push(r);
          map.set(key, arr);
        }
        const gs: Group[] = Array.from(map.entries()).map(([groupId, rows]) => {
          const groupName = (rows[0].GroupName && String(rows[0].GroupName).trim()) || rows[0].Name;
          return {
            groupId,
            groupName,
            members: rows.map((r) => ({ id: r.ID, name: r.Name, attendance: r.Attendance })),
            rows,
          };
        });
        setGroups(gs);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error(message || "Failed to load RSVP list");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedGroup(null);
  };

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 3) return [] as Group[];
    return groups.filter((g) => {
      if (g.groupName.toLowerCase().includes(q)) return true;
      return g.members.some((m) => m.name.toLowerCase().includes(q));
    });
  }, [groups, searchQuery]);

  const resultsOpen = searchQuery.trim().length >= 3 && filteredGroups.length > 0;
  const needsMoreChars = searchQuery.trim().length > 0 && searchQuery.trim().length < 3;

  const handleSelectGuest = (g: Group) => {
    const memberNames = g.members.map((m) => m.name);
    setSelectedGroup(memberNames);
    setSelectedGroupRows(g.rows);
    setSearchQuery("");
  };

  const updateLocalAttendance = (rowId: string, attendance: "Going" | "Not Going") => {
    setGroups((prev) =>
      prev.map((g) => {
        const rows = g.rows.map((r) => (r.ID === rowId ? { ...r, Attendance: attendance } : r));
        const members = g.members.map((m) => (m.id === rowId ? { ...m, attendance } : m));
        return { ...g, rows, members };
      })
    );
    setSelectedGroupRows((prev) =>
      prev ? prev.map((r) => (r.ID === rowId ? { ...r, Attendance: attendance } : r)) : prev
    );
  };

  const handleSetAttendance = async (row: RsvpRow, attendance: "Going" | "Not Going") => {
    const rowId = row.ID;
    if (rowLoading[rowId]) return;
    if (row.Attendance === attendance) return;

    const now = Date.now();
    const history = attemptHistory[rowId] || [];
    const recent = history.filter((ts) => now - ts < 10000);
    if (recent.length >= 3) {
      const oldest = Math.min(...recent);
      const waitMs = 10000 - (now - oldest);
      const secs = Math.max(1, Math.ceil(waitMs / 1000));
      toast.info(`Taking a tiny breather 🙂 Try again in ${secs}s.`);
      return;
    }
    setAttemptHistory((prev) => ({ ...prev, [rowId]: [...recent, now] }));

    setRowLoading((prev) => ({ ...prev, [rowId]: true }));
    try {
      await updateAttendance(rowId, attendance);

      updateLocalAttendance(rowId, attendance);

      const name = row.Name;
      const successGoing = [
        (n: string) => `Yay, ${n} is in! See you there 🎉`,
        (n: string) => `Got it — saving a seat for ${n} 🙌`,
        (n: string) => `${n} is marked as Going. We’re excited! 💃`,
      ];
      const successNotGoing = [
        (n: string) => `We’ll miss you, ${n}. If plans change, we’d love to see you 💛`,
        (n: string) => `It won’t be the same without you, ${n}. Think you could reconsider? 🙂`,
        (n: string) => `Totally understand, ${n}. But we’d be so happy if you could make it!`,
      ];
      const pick = <T,>(arr: ((x: string) => T)[]) => arr[Math.floor(Math.random() * arr.length)];
      const msg = attendance === "Going" ? pick(successGoing)(name) : pick(successNotGoing)(name);
      toast.success(msg);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || `Could not update ${row.Name}. Please try again.`);
    } finally {
      setRowLoading((prev) => ({ ...prev, [rowId]: false }));
    }
  };

  const AttendanceButtons = ({
    row,
    isLoading,
    goingSelected,
    notGoingSelected,
    onSet,
  }: {
    row: RsvpRow;
    isLoading: boolean;
    goingSelected: boolean;
    notGoingSelected: boolean;
    onSet: (row: RsvpRow, attendance: "Going" | "Not Going") => void;
  }) => {
    const goingIconClass = goingSelected ? "text-primary-foreground" : "text-green-600";
    const notGoingIconClass = notGoingSelected ? "text-destructive-foreground" : "text-red-600";
    return (
      <div className="relative w-full">
        <div className="flex flex-col gap-2 px-0 sm:flex-row sm:items-center sm:gap-3 justify-end ">
          <div className="flex w-full flex-row px-0 flex-nowrap gap-2 sm:w-auto sm:flex-nowrap">
            <Button
              variant={goingSelected ? "default" : "outline"}
              size="sm"
              disabled={isLoading}
              onClick={() => onSet(row, "Going")}
              className="flex-1 justify-center px-3 py-2 text-sm leading-5 sm:flex-none sm:w-auto sm:px-4 sm:py-2 gap-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className={`h-4 w-4 ${goingIconClass}`} />
              )}
              Will Attend
            </Button>
            <Button
              variant={notGoingSelected ? "destructive" : "outline"}
              size="sm"
              disabled={isLoading}
              onClick={() => onSet(row, "Not Going")}
              className="flex-1 justify-center px-3 py-2 text-sm leading-5 sm:flex-none sm:w-auto sm:px-4 sm:py-2 gap-1"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className={`h-4 w-4 ${notGoingIconClass}`} />
              )}
              Won't Attend
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/70">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="rsvp-section" className="py-20 px-3 sm:px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-4xl px-0 sm:px-2"
      >
        <div className="mb-4 text-center">
          <h2 className="mb-4 text-5xl font-bold text-foreground md:text-6xl">
            RSVP
          </h2>
          <p className="text-lg text-muted-foreground">
            We can't wait to celebrate with you
          </p>
        </div>

        <Card className="border-none bg-card p-4 shadow-xl sm:p-6 md:p-12">
          <>
              <div className="mb-8">
                <div className="mb-4 rounded-md border border-black/10 bg-secondary/20 p-3 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Please Note:</p>
                  <p>
                    Due to venue limitations and family size, we’ve made the difficult decision to keep our
                    guest list to family and close friends.
                  </p>
                </div>
                <label className="mb-2 block text-sm font-medium">
                  Find your name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for your name..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 h-14 text-base sm:text-lg"
                  />
                </div>
                {needsMoreChars && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Enter at least 3 letters to see your name.
                  </p>
                )}
              </div>

              <div
                className={`mb-8 rounded-lg border bg-secondary/20 p-2 transition-[max-height,opacity] duration-300 ease-in-out ${
                  resultsOpen ? "max-h-[420px] opacity-100 overflow-y-auto" : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <div className={resultsOpen ? "pointer-events-auto" : "pointer-events-none"}>
                  {filteredGroups.map((g, idx) => {
                    const isSingle = g.members.length === 1;
                    if (isSingle) {
                      const row = g.rows[0];
                      const isLoading = !!rowLoading[row.ID];
                      const goingSelected = row.Attendance === "Going";
                      const notGoingSelected = row.Attendance === "Not Going";
                      return (
                        <Fragment key={g.groupId}>
                          <div
                            className={`flex w-full flex-col gap-2 rounded-md p-2 text-left transition-colors hover:bg-secondary sm:flex-row sm:items-center sm:gap-3 ${
                              isLoading ? "pointer-events-none opacity-70" : ""
                            }`}
                          >
                            <div className="w-full text-center sm:text-left">
                              <p className="font-medium">{g.groupName}</p>
                            </div>
                            <AttendanceButtons
                              row={row}
                              isLoading={isLoading}
                              goingSelected={goingSelected}
                              notGoingSelected={notGoingSelected}
                              onSet={handleSetAttendance}
                            />
                          </div>
                          {idx !== filteredGroups.length - 1 && (
                            <div className="my-2 h-[2px] w-full bg-gradient-to-r from-transparent via-border/70 to-transparent" />
                          )}
                        </Fragment>
                      );
                    }
                    return (
                      <Fragment key={g.groupId}>
                        <button
                          onClick={() => handleSelectGuest(g)}
                          className="group flex w-full items-center gap-3 rounded-md p-3 text-left transition-colors hover:bg-secondary"
                        >
                          <Users className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{g.groupName}</p>
                            <p className="text-sm text-muted-foreground">
                              {g.members.length} {g.members.length === 1 ? "person" : "people"}
                            </p>
                          </div>
                          <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
                            <span>Check attendance</span>
                            <span className="transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
                          </div>
                        </button>
                        {idx !== filteredGroups.length - 1 && (
                          <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-border/70 to-transparent" />
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              </div>

              {selectedGroup && selectedGroupRows && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">
                      Who will be attending?
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedGroup(null);
                        setSelectedGroupRows(null);
                        setRowLoading({});
                        setAttemptHistory({});
                      }}
                      className="gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to search
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {selectedGroupRows.map((row, idx) => {
                      const isLoading = !!rowLoading[row.ID];
                      const goingSelected = row.Attendance === "Going";
                      const notGoingSelected = row.Attendance === "Not Going";
                      return (
                        <div
                          key={row.ID}
                          className={`relative flex flex-col gap-3 rounded-lg border bg-secondary/10 p-4 transition-colors hover:bg-secondary/20 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
                            isLoading ? "pointer-events-none opacity-80" : ""
                          } ${idx !== selectedGroupRows.length - 1 ? "border-b border-border pb-6 mb-4 sm:border-b-0 sm:pb-4 sm:mb-3" : ""}`}
                        >
                          <div className="text-base font-medium text-center sm:text-left">{row.Name}</div>
                          <AttendanceButtons
                            row={row}
                            isLoading={isLoading}
                            goingSelected={goingSelected}
                            notGoingSelected={notGoingSelected}
                            onSet={handleSetAttendance}
                          />
                          {isLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-end pr-4">
                              <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </>
        </Card>
      </motion.div>
    </section>
  );
};

export default RSVPSection;
