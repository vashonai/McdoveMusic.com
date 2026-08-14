import BeatCard from "@/components/BeatCard";
import type { Beat } from "@/lib/catalog";

export default function BeatGrid({ beats }: { beats: Beat[] }) {
  return (
    <div className="grid grid--4">
      {beats.map((b) => (
        <BeatCard key={b.id} beat={b} />
      ))}
    </div>
  );
}
