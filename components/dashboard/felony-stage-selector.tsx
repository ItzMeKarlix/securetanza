"use client";
import { useMapContext } from "@/context/MapContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FELONY_STAGES, type FelonyStage } from "@/lib/offense-classification";
const labels: Record<FelonyStage, string> = {
  CONSUMMATED: "Consummated",
  FRUSTRATED: "Frustrated",
  ATTEMPTED: "Attempted",
  UNKNOWN: "Unknown / not recorded",
};
export default function FelonyStageSelector({
  onPick,
}: {
  onPick?: () => void;
}) {
  const { selectedFelonyStage, setSelectedFelonyStage } = useMapContext();
  return (
    <Select
      value={selectedFelonyStage ?? "ALL"}
      onValueChange={(value) => {
        setSelectedFelonyStage(value === "ALL" ? null : (value as FelonyStage));
        onPick?.();
      }}
    >
      <SelectTrigger
        aria-label="Stage of felony"
        className="h-11 min-w-[160px] w-auto max-w-full rounded-xl bg-white text-slate-700 border-slate-200 dark:bg-white/[0.04] dark:text-white/80 dark:border-white/[0.08]"
      >
        <SelectValue placeholder="All felony stages" />
      </SelectTrigger>
      <SelectContent onMouseDown={(event) => event.stopPropagation()}>
        <SelectItem value="ALL">All felony stages</SelectItem>
        {FELONY_STAGES.map((stage) => (
          <SelectItem value={stage} key={stage}>
            {labels[stage]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
