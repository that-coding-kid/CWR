import GradingPanel from "./GradingPanel";
import FeedbackList from "./FeedbackList";

export default function FeedbackPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <GradingPanel />
      </div>
      <div className="flex-1 min-h-0">
        <FeedbackList />
      </div>
    </div>
  );
}
