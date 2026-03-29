import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { RsvpGuestRow } from "@/types/wedding";

interface RsvpCsvExportProps {
  guests: RsvpGuestRow[];
  slug: string;
}

const RsvpCsvExport = ({ guests, slug }: RsvpCsvExportProps) => {
  const handleExport = () => {
    const headers = ["Name", "Group", "Attendance", "Updated At"];
    const rows = guests.map((g) => [
      g.name,
      g.group_name ?? "",
      g.attendance ?? "No response",
      g.updated_at,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvp-${slug}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
};

export default RsvpCsvExport;
