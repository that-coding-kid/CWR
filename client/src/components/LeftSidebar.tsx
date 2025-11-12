import ReferencePapers from "./ReferencePapers";
import AutoSummaryPanel from "./AutoSummaryPanel";

export default function LeftSidebar() {
  return (
    <div className="flex flex-col h-full bg-sidebar border-r">
      <div className="flex-1 min-h-0">
        <ReferencePapers />
      </div>
      <div className="flex-1 min-h-0">
        <AutoSummaryPanel />
      </div>
    </div>
  );
}
