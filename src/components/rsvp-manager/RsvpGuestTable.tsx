import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import type { RsvpGuestRow } from "@/types/wedding";
import RsvpCsvExport from "./RsvpCsvExport";

interface RsvpGuestTableProps {
  slug: string;
}

const ATTENDANCE_OPTIONS = ["Going", "Not Going", "Maybe"] as const;
type Attendance = (typeof ATTENDANCE_OPTIONS)[number];

function useRsvpGuests(slug: string) {
  return useQuery({
    queryKey: ["rsvp-guests", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rsvp_guests")
        .select("*")
        .eq("slug", slug)
        .order("group_name", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as RsvpGuestRow[];
    },
  });
}

const RsvpGuestTable = ({ slug }: RsvpGuestTableProps) => {
  const qc = useQueryClient();
  const { data: guests = [], isLoading, error } = useRsvpGuests(slug);

  const [addingGuest, setAddingGuest] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGroup, setNewGroup] = useState("");

  const addGuest = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("rsvp_guests").insert({
        slug,
        name: newName.trim(),
        group_name: newGroup.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rsvp-guests", slug] });
      setNewName("");
      setNewGroup("");
      setAddingGuest(false);
    },
  });

  const updateAttendance = useMutation({
    mutationFn: async ({ id, attendance }: { id: string; attendance: Attendance | null }) => {
      const { error } = await supabase
        .from("rsvp_guests")
        .update({ attendance, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rsvp-guests", slug] });
    },
  });

  const deleteGuest = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rsvp_guests").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rsvp-guests", slug] });
    },
  });

  // Stats
  const going = guests.filter((g) => g.attendance === "Going").length;
  const notGoing = guests.filter((g) => g.attendance === "Not Going").length;
  const noResponse = guests.filter((g) => !g.attendance).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive py-4">
        Failed to load guests. Make sure Supabase is configured.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Attending", count: going, color: "text-green-600" },
          { label: "Not Attending", count: notGoing, color: "text-red-500" },
          { label: "No Response", count: noResponse, color: "text-muted-foreground" },
        ].map(({ label, count, color }) => (
          <div key={label} className="rounded-lg bg-muted/50 p-3">
            <p className={`text-xl font-bold ${color}`}>{count}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-between">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setAddingGuest(true)}
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Guest
        </Button>
        <RsvpCsvExport guests={guests} slug={slug} />
      </div>

      {/* Add guest form */}
      {addingGuest && (
        <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
          <Input
            placeholder="Guest name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="h-8 text-sm"
          />
          <Input
            placeholder="Group name (optional)"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            className="h-8 text-sm"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => addGuest.mutate()}
              disabled={!newName.trim() || addGuest.isPending}
              className="flex-1"
            >
              {addGuest.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setAddingGuest(false); setNewName(""); setNewGroup(""); }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Guest list */}
      <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
        {guests.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            No guests yet. Add your first guest above.
          </p>
        ) : (
          guests.map((guest) => (
            <div
              key={guest.id}
              className="flex items-center gap-2 rounded-lg border bg-background p-2.5"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{guest.name}</p>
                {guest.group_name && (
                  <p className="text-xs text-muted-foreground truncate">{guest.group_name}</p>
                )}
              </div>

              {/* Attendance selector */}
              <div className="flex gap-1 shrink-0">
                {ATTENDANCE_OPTIONS.map((opt) => {
                  const isSelected = guest.attendance === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() =>
                        updateAttendance.mutate({
                          id: guest.id,
                          attendance: isSelected ? null : opt,
                        })
                      }
                      title={opt}
                      className={`h-6 w-6 rounded-full text-[10px] font-medium border transition-colors ${
                        isSelected
                          ? opt === "Going"
                            ? "bg-green-100 border-green-400 text-green-700"
                            : opt === "Not Going"
                            ? "bg-red-100 border-red-400 text-red-700"
                            : "bg-yellow-100 border-yellow-400 text-yellow-700"
                          : "bg-muted border-border text-muted-foreground hover:border-foreground/30"
                      }`}
                    >
                      {opt === "Going" ? <Check className="h-3 w-3 mx-auto" /> : opt === "Not Going" ? <X className="h-3 w-3 mx-auto" /> : "?"}
                    </button>
                  );
                })}
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteGuest.mutate(guest.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Delete guest"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RsvpGuestTable;
